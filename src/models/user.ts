import { IUserSchema } from "../interfaces/iuser_schema";
import { UserStorage } from "../storage/user_storage";

export class User {

  get id(): number {
    return this.attributes.id;
  }

  public static find(
    id: number, store: UserStorage = new UserStorage()): Promise<User> {
      return store.find(id);
  }

  public static findOrCreateBy(
    attributes: IUserSchema,
    store: UserStorage = new UserStorage()): Promise<User> {
      return store.findOrCreateBy(attributes);
  }
  private attributes: IUserSchema;

  constructor(attributes: IUserSchema) {
    this.attributes = {...attributes};
  }
}
