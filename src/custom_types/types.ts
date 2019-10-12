import { ICircle } from "../interfaces/icircle";
export type ValueOf<T> = T[keyof T];
export type Shape = ICircle;
export interface IRecordable {id?: number; }
export type ModelSaveRequest<T extends IRecordable> = {
  [K in keyof T] : T[K] extends IRecordable ? ModelSaveRequest<T[K]> : T[K]
};

export type ModelFindOrSaveRequest<T extends IRecordable> = {
  [K in keyof T]: T[K] extends IRecordable ? never : T[K]
};
