import { IModelAssociationConfig } from "./imodel_association_config";

export interface IModelConfig {
  tableName?: string,
  associations?: IModelAssociationConfig[],
}
