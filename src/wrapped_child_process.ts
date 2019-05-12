import { ChildProcess } from "child_process";
import { IProcess } from "./interfaces/iprocess";

export class WrappedChildProcess implements IProcess {
  private rawProcess: ChildProcess;

  constructor(rawProcess: ChildProcess) {
    this.rawProcess = rawProcess;
  }

  public send(message: any): void {
    this.rawProcess.send(message);
  }

  public on(event: string, callback: (payload: object) => void): void {
    this.rawProcess.on(event, callback);
  }
}
