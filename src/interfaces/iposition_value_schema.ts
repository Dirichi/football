import { ITextSchema } from "./itext_schema";

export interface IPositionValueSchema {
  currentPositionX: number;
  currentPositionY: number;
  potentialPositionsAndValues: ITextSchema[];
}
