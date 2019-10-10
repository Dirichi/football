import { Pool } from "pg";
import { camelToSnakeCase, snakeToCamelCase } from "../utils/helper_functions";
import { Logger } from "../utils/logger";
import { getConnectionPool } from "./connection_pool";
import { QueryBuilder } from "./query_builder";

export class StorageService<A extends { id: number }, M> {
  constructor(
    private modelKlass: new (attributes: A) => M,
    private tableName: string = `${camelToSnakeCase(modelKlass.name)}s`,
    private pool: Pool = getConnectionPool()
  ) { }

  public find(id: number): Promise<M | null> {
    // HACK: Shouldn't have to coerce the type here.
    const attributes = { id } as Partial<A>;
    return this.findBy(attributes);
  }

  public async where(attributes: Partial<A>, limit: number = null): Promise<M[]> {
    const { template, parameters } =
      QueryBuilder.withTable(this.tableName)
        .generateSelectQuery(attributes, limit);
    Logger.log({template, parameters});
    const queryResult = await this.pool.query(template, parameters);
    return queryResult.rows.map((row) => this.buildModelFromDb(row));
  }

  public async findOrCreateBy(attributes: Partial<A>): Promise<M> {
    const maybeModel = await this.findBy(attributes);
    if (!maybeModel) {
      return this.create(attributes);
    }
    return maybeModel;
  }

  public async findBy(attributes: Partial<A>): Promise<M | null> {
    const records = await this.where(attributes, 1);
    return records[0] || null;
  }

  public async create(attributes: Partial<A>): Promise<M> {
    const query =
      QueryBuilder.withTable(this.tableName).generateInsertQuery(attributes);
    Logger.log(query);
    const queryResult = await this.pool.query(query.template, query.parameters);
    return this.buildModelFromDb(queryResult.rows[0]);
  }

  public async update(id: number, attributes: Partial<A>): Promise<M> {
    const {parameters, template} =
      QueryBuilder
        .withTable(this.tableName).generateUpdateQuery(id, attributes);
    Logger.log({template, parameters});
    const queryResult = await this.pool.query(template, parameters);
    return this.buildModelFromDb(queryResult.rows[0]);
  }

  private buildModelFromDb(dbAttributes: object): M {
    const entries = Object.entries(dbAttributes);
    const attributes = entries.reduce(
      (modelAttributes: { [k: string]: any }, [key, value]) => {
        const modelKey = snakeToCamelCase(key);
        modelAttributes[modelKey] = value;
        return modelAttributes;
      }, {});

    // HACK: We should not have to coerce the type
    return new this.modelKlass(attributes as A);
  }
}
