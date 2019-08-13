import { EventQueue } from "../../src/event_queue";
import { IProcess } from "../../src/interfaces/iprocess";

export class TestProcess implements IProcess {
  private queue: EventQueue;

  constructor() {
    this.queue = new EventQueue();
  }

  public on(event: string, callback: (payload: object) => void): void {
    this.queue.when(event, callback);
  }

  public send(message: string): void {
    return;
  }

  public sendMessageToMainProcess(message: object) {
    this.queue.trigger("message", message);
  }

  public termintate(): void {
    return;
  }
}
