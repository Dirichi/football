import { EventQueue } from "../../src/event_queue";
import { IGameClient } from "../../src/interfaces/igame_client";
import { IO_MESSAGE_TYPE } from "../../src/constants";

export class TestGameClient implements IGameClient {
  private id: string;
  private queue: EventQueue;

  constructor(id: string) {
    this.id = id;
    this.queue = new EventQueue();
  }
  public send(messageType: IO_MESSAGE_TYPE, message: any): void {
    return;
  }

  public when(event: string, callback: (payload: object) => void): void {
    this.queue.when(event, callback);
  }

  public simulateEvent(event: string, payload: object): void {
    this.queue.trigger(event, payload);
  }

  public getId(): string {
    return this.id;
  }
}
