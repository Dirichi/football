import { fork } from "child_process";
import { IProcessForker } from "./interfaces/iprocess_forker";
import { WrappedChildProcess } from "./wrapped_child_process";

export class WrappedProcessForker implements IProcessForker {
  public fork(executablePath: string): WrappedChildProcess {
    const childProcess = fork(executablePath);
    return new WrappedChildProcess(childProcess);
  }
}
