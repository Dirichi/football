import { ValueOf } from "src/custom_types/types";

export interface IQuery<T> {
  parameters: Array<ValueOf<T>>;
  template: string;
}
