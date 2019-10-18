import { IEventQueue } from "../../src/interfaces/ievent_queue";

export class TestEventQueue implements IEventQueue {
  private events: Map<string, Array<(payload: object) => void>>;
  public triggeredEvents: Map<string, object[]>

  constructor(events?: Map<string, Array<(payload: object) => void>>) {
    this.events = events || new Map();
    this.triggeredEvents = new Map();
  }

  public trigger(event: string, payload: object) {
    const payloads = this.triggeredEvents.get(event) || [];
    payloads.push(payload);
    this.triggeredEvents.set(event, payloads);

    const callbacks = this.events.get(event) || [];
    callbacks.forEach((callback) => {
      callback.call(this, payload);
    });
  }

  public when(event: string, callback: (this: void, payload: object) => void) {
    const callbacks = this.events.get(event) || [];
    callbacks.push(callback);
    this.events.set(event, callbacks);
  }

  public once(event: string, callback: (payload: object) => void) {
    throw new Error("unimplemented");
  }
}
