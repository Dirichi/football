import { ChildProcess } from "child_process";
import { IProcess } from "./interfaces/iprocess";

export class WrappedChildProcess implements IProcess {
  private rawProcess: ChildProcess;

  constructor(rawProcess: ChildProcess) {
    this.rawProcess = rawProcess;
  }

  public send(message: any): void {
    if (this.rawProcess.killed) {
      // tslint:disable-next-line:no-console
      console.log(`Cannot send messages to gameProcess with \
        pid: ${this.rawProcess.pid} since it has been killed.`);
      return;
    }
    this.rawProcess.send(message);
  }

  public on(event: string, callback: (payload: object) => void): void {
    this.rawProcess.on(event, callback);
  }

  public termintate(): void {
    this.rawProcess.kill("SIGTERM");
  }
}
