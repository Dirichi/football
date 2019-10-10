import { IUserAttributes } from "../interfaces/iuser_attributes";
import { StorageService } from "../storage/storage_service";

export class User {
  get id(): number {
    return this.attributes.id;
  }

  public static find(id: number): Promise<User> {
    return this.store().find(id);
  }

  public static findOrCreateBy(
    attributes: Partial<IUserAttributes>): Promise<User> {
    return this.store().findOrCreateBy(attributes);
  }

  private static store(): StorageService<IUserAttributes, User> {
      return new StorageService(User, {});
  }
  private attributes: IUserAttributes;

  constructor(attributes: IUserAttributes) {
    this.attributes = { ...attributes };
  }
}
