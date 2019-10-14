import { Pool } from "pg";
import { ModelQueryRequest } from "../custom_types/types";
import { snakeToCamelCase } from "../utils/helper_functions";
import { getConnectionPool } from "./connection_pool";
import { QueryBuilder } from "./query_builder";

export class StorageService<A extends { id?: number }> {
  constructor(
    private tableName: string,
    private pool: Pool = getConnectionPool()
  ) { }

  public find(id: number): Promise<A | null> {
    // HACK: Shouldn't have to coerce the type here.
    const attributes = { id } as ModelQueryRequest<A>;
    return this.findBy(attributes);
  }

  public async where(attributes: ModelQueryRequest<A>): Promise<A[]> {
    return await this.search(attributes);
  }

  public async findBy(attributes: ModelQueryRequest<A>): Promise<A | null> {
    const records = await this.search(attributes, 1);
    return records[0] || null;
  }

  public async create(attributes: A): Promise<A> {
    const query =
      QueryBuilder.withTable(this.tableName).generateInsertQuery(attributes);
    const queryResult = await this.pool.query(query.template, query.parameters);
    return this.buildModelFromDb(queryResult.rows[0]);
  }

  public async update(id: number, attributes: Partial<A>): Promise<A> {
    const { parameters, template } =
      QueryBuilder
        .withTable(this.tableName).generateUpdateQuery(id, attributes);
    const queryResult = await this.pool.query(template, parameters);
    return this.buildModelFromDb(queryResult.rows[0]);
  }

  private buildModelFromDb(dbAttributes: object): A {
    const entries = Object.entries(dbAttributes);
    const attributes = entries.reduce(
      (modelAttributes: { [k: string]: any }, [key, value]) => {
        const modelKey = snakeToCamelCase(key);
        modelAttributes[modelKey] = value;
        return modelAttributes;
      }, {});

    // HACK: We should not have to coerce the type
    return attributes as A;
  }

  private async search(
    attributes: ModelQueryRequest<A>, limit: number = null): Promise<A[]> {
      const { template, parameters } =
        QueryBuilder.withTable(this.tableName)
          .generateSelectQuery(attributes, limit);
      const queryResult = await this.pool.query(template, parameters);
      return queryResult.rows.map((row) => this.buildModelFromDb(row));
  }
}
