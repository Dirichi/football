import { ICircle } from "../interfaces/icircle";
export type ValueOf<T> = T[keyof T];

export type ModelPartial<T> =
  { [K in keyof T]?: T[K] extends { id: number } ? Partial<T[K]> : T[K] };

export type Shape = ICircle;
