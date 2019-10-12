import { ModelSaveRequest } from "../custom_types/types";

export interface IModelStore<T extends {id?: number} > {
  findBy(attributes: Partial<T>): Promise<T>;
  find(id: number): Promise<T>;
  create(attributes: ModelSaveRequest<T>): Promise<T>;
  update(id: number, attributes: Partial<T>): Promise<T>;
  findOrCreateBy(attributes: Partial<T>): Promise<T>;
  where(attributes: Partial<T>): Promise<T[]>;
}
