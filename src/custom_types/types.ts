import { ICircle } from "../interfaces/icircle";
export type ValueOf<T> = T[keyof T];
export type Shape = ICircle;
export interface IRecordable {id?: number; }

export type ModelFindOrSaveRequest<T extends IRecordable> = {
  [K in keyof T]: T[K] extends IRecordable ? never : T[K]
};

type Flatten<T> = T extends Array<infer R> ? R : T;

export type ModelQueryRequest<T extends IRecordable> = {
  [K in keyof T]?: T[K] extends IRecordable[] ? ModelQueryRequest<Flatten<T[K]>> : T[K] | Array<T[K]>
};
