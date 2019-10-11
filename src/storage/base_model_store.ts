import { IModelStore } from "../interfaces/imodel_store";
import { StorageService } from "./storage_service";

export class BaseModelStore<A extends {id: number}> implements IModelStore<A> {
  private internalStore: StorageService<A>;
  constructor(private tableName: string) {
    this.internalStore = new StorageService(tableName);
  }

  public async findBy(attributes: Partial<A>): Promise<A> {
    return this.internalStore.findBy(attributes);
  }
  public async find(id: number): Promise<A> {
    return this.internalStore.find(id);
  }
  public async findOrCreateBy(attributes: Partial<A>): Promise<A> {
    return this.internalStore.findOrCreateBy(attributes);
  }
  public async create(attributes: Partial<A>): Promise<A> {
    return this.internalStore.create(attributes);
  }
  public async where(attributes: Partial<A>): Promise<A[]> {
    return this.internalStore.where(attributes);
  }

  public async update(id: number, attributes: Partial<A>): Promise<A> {
    return this.internalStore.update(id, attributes);
  }
}
