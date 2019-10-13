import { ModelQueryRequest } from "../custom_types/types";

export interface IModelStore<T extends {id?: number} > {
  findBy(attributes: ModelQueryRequest<T>): Promise<T>;
  find(id: number): Promise<T>;
  create(attributes: T): Promise<T>;
  update(id: number, attributes: Partial<T>): Promise<T>;
  where(attributes: ModelQueryRequest<T>): Promise<T[]>;
}
