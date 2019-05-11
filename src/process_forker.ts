import { ChildProcess, fork } from "child_process";

export class WrappedProcessForker implements IProcessForker {
  public fork(executablePath: string): WrappedChildProcess {
    const childProcess = fork(executablePath);
    return new WrappedChildProcess(childProcess);
  }
}

export class WrappedChildProcess implements IProcess {
  private rawProcess: ChildProcess;

  constructor(rawProcess: ChildProcess) {
    this.rawProcess = rawProcess;
  }

  public send(message: any) {
    return;
  }
}
