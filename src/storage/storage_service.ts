import { Pool } from "pg";
import { camelToSnakeCase, snakeToCamelCase } from "../utils/helper_functions";
import { getConnectionPool } from "./connection_pool";
import { QueryBuilder } from "./query_builder";
import { ModelPartial } from "../custom_types/types";
import { IModelConfig } from "../interfaces/imodel_config";

export class StorageService<A extends { id: number }, M> {
  private tableName: string;

  constructor(
    private modelKlass: new (attributes: A) => M,
    private modelConfig: IModelConfig,
    private pool: Pool = getConnectionPool()
  ) {
    this.tableName =
      modelConfig.tableName || `${camelToSnakeCase(this.modelKlass.name)}s`;
  }

  public find(id: number): Promise<M | null> {
    // HACK: Shouldn't have to coerce the type here.
    const attributes = { id } as ModelPartial<A>;
    return this.findBy(attributes);
  }

  public async where(
    attributes: ModelPartial<A>, limit: number = null): Promise<M[]> {
    const { template, parameters } =
      QueryBuilder.generateFilterQuery(attributes, this.modelConfig, limit);
    const queryResult = await this.pool.query(template, parameters);
    return queryResult.rows.map((row) => this.buildModelFromDb(row));
  }

  public async findOrCreateBy(attributes: ModelPartial<A>): Promise<M> {
    const maybeModel = await this.findBy(attributes);
    if (!maybeModel) {
      return this.create(attributes);
    }
    return maybeModel;
  }

  public async findBy(attributes: ModelPartial<A>): Promise<M | null> {
    const records = await this.where(attributes, 1);
    return records[0] || null;
  }

  public async create(attributes: ModelPartial<A>): Promise<M> {
    const query = QueryBuilder.generateInsertQuery(attributes, this.modelConfig);
    const queryResult = await this.pool.query(query.template, query.parameters);
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
