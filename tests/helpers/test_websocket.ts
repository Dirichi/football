import { IWebSocket } from "../../src/iweb_socket";

export class TestWebSocket implements IWebSocket {
  private events: Map<string, Array<Function>>;

  constructor() {
    this.events = new Map();
  }

  public emit(event: string, message: any) {
    const callbacks = this.events.get(event) || [];
    callbacks.forEach((callback) => callback.call(this, message));
  }

  public on(event: string, callback: Function) {
    let callbacks = this.events.get(event) || [];
    callbacks.push(callback);
    this.events.set(event, callbacks);
  }
}
