import { ModelPartial, ValueOf } from "../custom_types/types";
import { camelToSnakeCase, range } from "../utils/helper_functions";
import { IQuery } from "../interfaces/iquery";
import { IModelConfig } from "../interfaces/imodel_config";

export class QueryBuilder {
  public static generateInsertQuery<A>(
    attributes: ModelPartial<A>, modelConfig: IModelConfig): IQuery<ModelPartial<A>> {
    const attributesToChange = [];
    const parameters = [];
    const associationQueries: QueryBuilder[] = [];
    const associations = (modelConfig.associations || []);
    const associationModels =
      associations.map((association) => association.model);
    for (let [attribute, updateValue] of Object.entries(attributes)) {
      if (associationModels.includes(attribute)) {
        const query = this.generateInsertQuery(updateValue);
        associationQueries.push(query);
      } else {
        attributesToChange.push(attribute);
        parameters.push(updateValue);
      }
    }
    const columnsToChange = attributesToChange.map(camelToSnakeCase);
    const parameterSubstitutions = range(columnsToChange.length)
      .map((index) => `$${index + 1}`);

    const queryTemplate =
      `INSERT INTO ${modelConfig.tableName}(${columnsToChange.join(", ")}) \
      values(${parameterSubstitutions.join(", ")}) RETURNING *;`;
    return {
      parameters: parameters,
      template: queryTemplate,
    };
  }

  public static generateFilterQuery<A>(
    attributes: ModelPartial<A>,
    modelConfig: IModelConfig,
    limit: number): IQuery<ModelPartial<A>> {
    const [columns, filterValues] = this.getColumnsAndValues(attributes);
    const filterTemplate =
      columns.map((column, index) => `${column} = $${index + 1}`).join(" AND");
    let queryTemplate =
      `SELECT * FROM ${modelConfig.tableName} WHERE ${filterTemplate}`;
    if (limit !== null) {
      queryTemplate = `${queryTemplate} LIMIT ${limit}`;
    }

    return {
      parameters: filterValues,
      template: queryTemplate,
    };
  }

  private static getColumnsAndValues<A>(
    attributes: A): [string[], Array<ValueOf<A>>] {
    const entries = Object.entries(attributes);
    return [
      entries.map((entry) => camelToSnakeCase(entry[0])),
      entries.map((entry) => entry[1]),
    ];
  }
}
