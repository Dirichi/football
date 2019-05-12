import { IProcess } from "./iprocess";
export interface IProcessForker {
  fork(executabelFile: string): IProcess;
}
