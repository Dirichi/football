import { Pool } from "pg";
import { IUserSchema } from "../interfaces/iuser_schema";
import { User } from "../models/user";
import { camelToSnakeCase, range, snakeToCamelCase } from "../utils/helper_functions";

type ValueOf<T> = T[keyof T];
interface IQuery<T> {
  parameters: Array<ValueOf<T>>;
  template: string;
}

export class UserStorage {
  constructor(private pool: Pool) {}

  public find(id: number): Promise<User> {
    const queryTemplate = `SELECT * FROM users WHERE id = $1 LIMIT 1`;
    return this.pool.query(queryTemplate, [id]).then((queryResult) => {
      return this.buildUserFromDb(queryResult.rows[0]);
    });
  }

  public findOrCreateBy(attributes: IUserSchema): Promise<User> {
    return this.findBy(attributes).then((maybeUser) => {
      if (!maybeUser) {
        return this.create(attributes);
      }

      return maybeUser;
    });
  }

  public findBy(attributes: IUserSchema): Promise<User|null> {
    const {template, parameters} = this.generateFilterQuery(attributes);
    const queryTemplate = `SELECT * FROM users WHERE ${template} LIMIT 1`;

    return this.pool.query(queryTemplate, parameters).then((queryResult) => {
      if (queryResult.rows.length === 0) { return null; }
      return this.buildUserFromDb(queryResult.rows[0]);
    });
  }

  public create(attributes: IUserSchema): Promise<User> {
    const query = this.generateInsertQuery(attributes);
    return this.pool.query(query.template, query.parameters)
      .then((queryResult) => {
          return this.buildUserFromDb(queryResult.rows[0]);
      });
  }

  private generateInsertQuery(attributes: IUserSchema): IQuery<IUserSchema> {
    const [changedAttributes, newValues] = this.getKeysAndValues(attributes);
    const attributesString = changedAttributes.map(camelToSnakeCase).join(", ");
    const parameterStrings = range(changedAttributes.length)
      .map((index) => `$${index + 1}`)
      .join(", ");

    const queryTemplate =
      `INSERT INTO users(${attributesString}) values(${parameterStrings}) \
       RETURNING *`;
    return {
      parameters: newValues,
      template: queryTemplate,
    };
  }

  private generateFilterQuery(attributes: IUserSchema): IQuery<IUserSchema> {
    const [filterKeys, filterValues] = this.getKeysAndValues(attributes);
    const dbFilterKeys = filterKeys.map(camelToSnakeCase);
    const template = dbFilterKeys.reduce((accumulator, key, index) => {
      const filter = `${key} = $${index + 1}`;
      return accumulator.length > 0 ? `${accumulator} AND ${filter}` : filter;
    }, "");

    return {
      parameters: filterValues,
      template,
    };
  }

  private getKeysAndValues<T>(attributes: T): [string[], Array<ValueOf<T>>] {
    const entries = Object.entries(attributes);
    return [
      entries.map((entry) => entry[0]),
      entries.map((entry) => entry[1]),
    ];
  }

  private buildUserFromDb(dbAttributes: object): User {
    const entries = Object.entries(dbAttributes);
    const attributes = entries.reduce(
      (modelAttributes: {[k: string]: any}, [key, value]) => {
      const modelKey = snakeToCamelCase(key);
      modelAttributes[modelKey] = value;
      return modelAttributes;
    }, {});

    return new User(attributes);
  }
}
