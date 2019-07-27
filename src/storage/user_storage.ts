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

  public create(attributes: IUserSchema): Promise<User> {
    const query = this.generateCreateQuery(attributes);
    return this.pool.query(query.template, query.parameters)
      .then((queryResult) => {
        const savedAttributes =
          this.dbAttributesToModelAttributes(queryResult.rows[0]);
        return new User(savedAttributes);
      });
  }

  private generateCreateQuery(attributes: IUserSchema): IQuery<IUserSchema> {
    const [changedAttributes, newValues] = this.getKeysAndValues(attributes);
    const attributesString = changedAttributes.map(camelToSnakeCase).join(", ");
    const parameterStrings = range(changedAttributes.length)
      .map((index) => `$${index + 1}`)
      .join(", ");

    const queryTemplate =
      `INSERT INTO USERS(${attributesString}) values(${parameterStrings}) \
       RETURNING *`;
    return {
      parameters: newValues,
      template: queryTemplate,
    };
  }

  private getKeysAndValues<T>(attributes: T): [string[], Array<ValueOf<T>>] {
    const entries = Object.entries(attributes);
    return [
      entries.map((entry) => entry[0]),
      entries.map((entry) => entry[1]),
    ];
  }

  private dbAttributesToModelAttributes(dbAttributes: object): IUserSchema {
    const entries = Object.entries(dbAttributes);
    const attributes = entries.reduce(
      (modelAttributes: {[k: string]: any}, [key, value]) => {
      const modelKey = snakeToCamelCase(key);
      modelAttributes[modelKey] = value;
      return modelAttributes;
    }, {});

    return attributes as IUserSchema;
  }
}
