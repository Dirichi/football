import { ValueOf } from "../custom_types/types";
import { IQuery } from "../interfaces/iquery";
import { camelToSnakeCase, isEmpty } from "../utils/helper_functions";

interface IFilter {
  leftOperand: string;
  operator: string;
  rightOperand: any;
  substitution: boolean;
}

export class QueryBuilder {
  public static withTable(tableName: string): QueryBuilder {
    return new QueryBuilder(tableName);
  }

  constructor(private tableName: string) { }

  public generateInsertQuery<A>(attributes: A): IQuery<A> {
    const entries = Array.from(Object.entries(attributes));
    const columns = entries.map(([key, _]) => camelToSnakeCase(key));
    const paramSubstitutions =
      [...Array(entries.length).keys()].map((v) => `$${v + 1}`);
    const queryTemplate =
      `INSERT INTO ${this.tableName}(${columns.join(", ")}) \
      values(${paramSubstitutions.join(", ")}) RETURNING *`;
    return this.build(queryTemplate, entries.map(([_, val]) => val));
  }

  public generateSelectQuery<A>(
    attributes: A, limit: number = null): IQuery<A> {
    const filterQuery = this.generateFilterQuery(attributes);
    let template =
      `SELECT * FROM ${this.tableName} WHERE ${filterQuery.template}`;
    if (limit != null) {
      template = `${template} LIMIT ${limit}`;
    }
    return this.build(template, filterQuery.parameters);
  }

  public generateUpdateQuery<A>(
    id: number, attributes: A): IQuery<A> {
    const { parameters, template } =
      this.generateFilterQuery(attributes, ["id"]);
    const updateTemplate =
      `UPDATE ${this.tableName} SET ${template} WHERE \
        id = ${id} RETURNING *`;
    return this.build(updateTemplate, parameters);
  }

  private generateFilterQuery<A>(
    attributes: A, exceptAttributeKeys: string[] = []): IQuery<A> {
    const defaultQuery = { template: "", parameters: [] } as IQuery<A>;
    return Array.from(Object.entries(attributes))
      .filter(([attrKey, _]) => !exceptAttributeKeys.includes(attrKey))
      .map(([attrKey, attrValue]) => this.buildFilter(attrKey, attrValue))
      .reduce((acc, filter) => this.addFilter<A>(acc, filter), defaultQuery);
  }

  private getFilterOperation(value: any): string {
    if (Array.isArray(value)) { return "IN"; }
    if (value === null) { return "IS"; }
    return "=";
  }

  private transformFilterParameters<A>(value: A): A | string {
    if (Array.isArray(value)) { return `(${value.join(", ")})`; }
    if (value === null) { return "NULL"; }
    return value;
  }

  private buildFilter(key: string, value: any): IFilter {
    return {
      leftOperand: camelToSnakeCase(key),
      operator: this.getFilterOperation(value),
      rightOperand: this.transformFilterParameters(value),
      substitution: value !== null && !Array.isArray(value),
    };
  }

  private addFilter<A>(acc: IQuery<A>, filter: IFilter): IQuery<A> {
    const {leftOperand, operator, rightOperand, substitution} = filter;
    const queryParameter =
      substitution ? `$${acc.parameters.length + 1}` : rightOperand;
    const filterTemplate = `${leftOperand} ${operator} ${queryParameter}`;

    if (substitution) { acc.parameters.push(rightOperand); }
    acc.template =
      isEmpty(acc.template) ? filterTemplate : `${acc.template} AND ${filterTemplate}`;
    return acc;
  }

  private build<A>(
    template: string, parameters: Array<ValueOf<A> | string>): IQuery<A> {
    return { parameters, template };
  }
}
