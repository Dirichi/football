import { IUserSchema } from "../interfaces/iuser_schema";

export class User {
  private attributes: IUserSchema;

  constructor(attributes: IUserSchema) {
    this.attributes = {...attributes};
  }

  get id(): number {
    return this.attributes.id;
  }
}
