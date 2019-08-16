import { Pool } from "pg";
import { camelToSnakeCase, range, snakeToCamelCase } from "../utils/helper_functions";
import { getConnectionPool } from "./connection_pool";

type ValueOf<T> = T[keyof T];

interface IQuery<T> {
  parameters: Array<ValueOf<T>>;
  template: string;
}

export class StorageService<A extends {id: number}, M> {
  constructor(
    private modelKlass: new (attributes: A) => M,
    private tableName: string = `${camelToSnakeCase(modelKlass.name)}s`,
    private pool: Pool = getConnectionPool()
  ) {}

  public find(id: number): Promise<M|null> {
    // HACK: Shouldn't have to coerce the type here.
    const attributes = {id} as Partial<A>;
    return this.findBy(attributes);
  }

  public where(attributes: Partial<A>, limit: number = null): Promise<M[]> {
    const {template, parameters} = this.generateFilterQuery(attributes);
    let queryTemplate = `SELECT * FROM ${this.tableName} WHERE ${template}`;
    if (limit !== null) {
      queryTemplate = `${queryTemplate} LIMIT ${limit}`;
    }

    return this.pool.query(queryTemplate, parameters).then((queryResult) => {
      return queryResult.rows.map((row) => this.buildModelFromDb(row));
    });
  }

  public findOrCreateBy(attributes: Partial<A>): Promise<M> {
    return this.findBy(attributes).then((maybeModel) => {
      if (!maybeModel) {
        return this.create(attributes);
      }

      return maybeModel;
    });
  }

  public async findBy(attributes: Partial<A>): Promise<M|null> {
    const records = await this.where(attributes, 1);
    return records[0] || null;
  }

  public create(attributes: Partial<A>): Promise<M> {
    const query = this.generateInsertQuery(attributes);
    return this.pool.query(query.template, query.parameters)
      .then((queryResult) => {
          return this.buildModelFromDb(queryResult.rows[0]);
      });
  }

  private generateInsertQuery(attributes: Partial<A>): IQuery<A> {
    const [columnsToChange, newValues] = this.getColumnsAndValues(attributes);
    const parameterStrings = range(columnsToChange.length)
      .map((index) => `$${index + 1}`)
      .join(", ");

    const queryTemplate =
      `INSERT INTO ${this.tableName}(${columnsToChange.join(", ")}) \
      values(${parameterStrings}) RETURNING *`;
    return {
      parameters: newValues,
      template: queryTemplate,
    };
  }

  private generateFilterQuery(attributes: Partial<A>): IQuery<A> {
    const [columns, filterValues] = this.getColumnsAndValues(attributes);
    const template =
      columns.map((column, index) => `${column} = $${index + 1}`).join(" AND");
    return {
      parameters: filterValues,
      template,
    };
  }

  private getColumnsAndValues<T>(attributes: T): [string[], Array<ValueOf<T>>] {
    const entries = Object.entries(attributes);
    return [
      entries.map((entry) => camelToSnakeCase(entry[0])),
      entries.map((entry) => entry[1]),
    ];
  }

  private buildModelFromDb(dbAttributes: object): M {
    const entries = Object.entries(dbAttributes);
    const attributes = entries.reduce(
      (modelAttributes: {[k: string]: any}, [key, value]) => {
      const modelKey = snakeToCamelCase(key);
      modelAttributes[modelKey] = value;
      return modelAttributes;
    }, {});

    // HACK: We should not have to coerce the type
    return new this.modelKlass(attributes as A);
  }
}
