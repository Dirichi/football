import { IModelStore } from "../../src/interfaces/imodel_store";
import { ModelQueryRequest } from "../../src/custom_types/types";
export class TestModelStore<T extends { id?: number }> implements IModelStore<T> {

  private lastId: number = 0;

  constructor(private internalStore: Map<number, T> = new Map([])) {
    const ids = Array.from(this.internalStore.keys());
    this.lastId = Math.max(...ids) + 1;
  }

  public async findBy(attributes: ModelQueryRequest<T>): Promise<T> {
    const matches = await this.where(attributes);
    return matches[0];
  }

  public find(id: number): Promise<T> {
    return Promise.resolve(this.internalStore.get(id));
  }

  public create(attributes: T): Promise<T> {
    return Promise.resolve({ ...this.synchronousCreate(attributes) });
  }

  public update(id: number, attributes: Partial<T>): Promise<T> {
    const attributesToUpdate = this.internalStore.get(id);
    Object.assign(attributesToUpdate, attributes);
    return Promise.resolve({ ...attributesToUpdate });
  }

  public where(query: ModelQueryRequest<T>): Promise<T[]> {
    const storedAttributes = Array.from(this.internalStore.values());
    const matchingAttributes =
      storedAttributes.filter((attribute) => this.match(query, attribute));
    return Promise.resolve(matchingAttributes);
  }

  private synchronousCreate(attributes: T): T {
    this.lastId += 1;
    const attributesToSave = { id: this.lastId, ...attributes } as T;
    this.internalStore.set(this.lastId, attributesToSave);
    return attributesToSave;
  }

  private match(query: ModelQueryRequest<T>, attributes: T): boolean {
    // TODO: Handle query for hasMany relationships; i.e. where the query
    // is like {pets: 'fish'} but the model is like {pets: ['fish', 'dog']}

    for (let key in query) {
      if (query[key] !== attributes[key]) {
        return false;
      }
    }
    return true;
  }
}
