import { IUserSchema } from "../interfaces/iuser_schema";

export class User {
  public attributes: IUserSchema;

  constructor(attributes: IUserSchema) {
    this.attributes = {...attributes};
  }
}
