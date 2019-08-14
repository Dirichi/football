import { IUserAttributes } from "../interfaces/iuser_attributes";
import { StorageService } from "../storage/storage_service";

export class User {
  get id(): number {
    return this.attributes.id;
  }

  public static store = new StorageService(User);
  public static find(id: number): Promise<User> {
    return this.store.find(id);
  }

  public static findOrCreateBy(
    attributes: Partial<IUserAttributes>): Promise<User> {
      return this.store.findOrCreateBy(attributes);
  }
  private attributes: IUserAttributes;

  constructor(attributes: IUserAttributes) {
    this.attributes = {...attributes};
  }
}
