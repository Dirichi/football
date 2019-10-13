import { ModelQueryRequest } from "../custom_types/types";
import { IModelStore } from "../interfaces/imodel_store";
import { StorageService } from "./storage_service";

export class BaseModelStore<A extends {id?: number}> implements IModelStore<A> {
  private internalStore: StorageService<A>;
  constructor(tableName: string) {
    this.internalStore = new StorageService(tableName);
  }

  public async findBy(attributes: ModelQueryRequest<A>): Promise<A> {
    return this.internalStore.findBy(attributes);
  }

  public async find(id: number): Promise<A> {
    return this.internalStore.find(id);
  }

  public async create(attributes: A): Promise<A> {
    return this.internalStore.create(attributes);
  }

  public async where(attributes: ModelQueryRequest<A>): Promise<A[]> {
    return this.internalStore.where(attributes);
  }

  public async update(id: number, attributes: Partial<A>): Promise<A> {
    return this.internalStore.update(id, attributes);
  }
}
