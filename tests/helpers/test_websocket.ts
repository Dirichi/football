import { IWebSocket } from "../../src/interfaces/iweb_socket";
import { EventQueue } from "../../src/event_queue";

export class TestWebSocket implements IWebSocket {
  private queue: EventQueue;
  private id: string;

  constructor(id: string, queue: EventQueue = new EventQueue()) {
    this.id = id;
    this.queue = queue;
  }

  public getId(): string {
    return this.id;
  }

  public on(event: string, callback: (payload: object) => void): void {
    this.queue.when(event, callback);
  }

  public emit(event: string, message: any): void {
    this.queue.trigger(event, message);
  }
}
