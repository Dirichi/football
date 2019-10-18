import { ICircle } from "../interfaces/icircle";
export type ValueOf<T> = T[keyof T];
export type Shape = ICircle;
export interface IRecordable {id?: number; }

type Flatten<T> = T extends Array<infer R> ? R : T;

export type ModelQueryRequest<T extends IRecordable> = {
  [K in keyof T]?: T[K] extends IRecordable[] ? ModelQueryRequest<Flatten<T[K]>> : T[K] | Array<T[K]>
};

type AnyFunction = (...args: any[]) => any;
export type PluckReturnTypes<T> = {
  [K in keyof T]?: T[K] extends AnyFunction ? ReturnType<T[K]> : never;
};
