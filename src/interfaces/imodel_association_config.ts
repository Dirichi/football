import { MODEL_ASSOCIATION_RELATIONSHIP } from "../constants";

export interface IModelAssociationConfig {
  relationship: MODEL_ASSOCIATION_RELATIONSHIP,
  model: string,
  joinColumn?: string,
}
