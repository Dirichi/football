import { ValueOf } from "../custom_types/types";
import { IQuery } from "../interfaces/iquery";
import { camelToSnakeCase, range } from "../utils/helper_functions";

interface IRecord {
  id?: number;
}

export class QueryBuilder {
  public static withTable(tableName: string): QueryBuilder {
    return new QueryBuilder(tableName);
  }

  constructor(private tableName: string) { }

  public generateInsertQuery<A extends IRecord>(attributes: A): IQuery<A> {
    const [columnsToChange, newValues] = this.getColumnsAndValues(attributes);
    const parameterStrings = range(columnsToChange.length)
      .map((index) => `$${index + 1}`)
      .join(", ");

    const queryTemplate =
      `INSERT INTO ${this.tableName}(${columnsToChange.join(", ")}) \
      values(${parameterStrings}) RETURNING *`;
    return this.build(queryTemplate, newValues);
  }

  public generateSelectQuery<A extends IRecord>(
    attributes: A, limit: number = null): IQuery<A> {
    const filterQuery = this.generateFilterQuery(attributes);
    let template =
      `SELECT * FROM ${this.tableName} WHERE ${filterQuery.template}`;
    if (limit != null) {
      template = `${template} LIMIT ${limit}`;
    }
    return this.build(template, filterQuery.parameters);
  }

  public generateUpdateQuery<A extends IRecord>(
    id: number, attributes: A): IQuery<A> {
    const { parameters, template } =
      this.generateFilterQuery(attributes, ["id"]);
    const updateTemplate =
      `UPDATE ${this.tableName} SET ${template} WHERE \
        id = ${id} RETURNING *`;
    return this.build(updateTemplate, parameters);
  }

  private generateFilterQuery<A extends IRecord>(
    attributes: A, exceptAttributeKeys: string[] = []): IQuery<A> {
    const [columns, values] =
      this.getColumnsAndValues(attributes, exceptAttributeKeys);
    const filterExpressions =
      columns.map((column, index) => `${column} = $${index + 1}`);
    return this.build(filterExpressions.join(" AND "), values);
  }

  private getColumnsAndValues<A extends IRecord>(
    attributes: A,
    exceptAttributeKeys: string[] = []): [string[], Array<ValueOf<A>>] {
    const columns: string[] = [];
    const values: Array<ValueOf<A>> = [];
    Object.entries(attributes)
      .forEach(([attributeKey, attributeValue]) => {
        if (!exceptAttributeKeys.includes(attributeKey)) {
          const column = `${camelToSnakeCase(attributeKey)}`;
          columns.push(column);
          values.push(attributeValue);
        }
      });
    return [columns, values];
  }

  private build<A>(template: string, parameters: Array<ValueOf<A>>): IQuery<A> {
    return { parameters, template };
  }
}
