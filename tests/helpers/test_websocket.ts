import { IWebSocket } from "../../src/interfaces/iweb_socket";
import { EventQueue } from "../../src/event_queue";

export class TestWebSocket implements IWebSocket {
  private queue: EventQueue;

  constructor(queue?: EventQueue = new EventQueue()) {
    this.queue = queue;
  }

  public on(event: string, callback: Function) {
    this.queue.when(event, callback);
  }

  public emit(event: string, message: any) {
    this.queue.trigger(event, message);
  }
}
