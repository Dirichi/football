import { IUserAttributes } from "../interfaces/iuser_attributes";
import { BaseModelStore } from "../storage/base_model_store";

export class UserStore extends BaseModelStore<IUserAttributes> {
  constructor(tableName: string = "users") {
    super(tableName);
  }
}
