import { IEventQueue } from "./interfaces/ievent_queue";

export class EventQueue implements IEventQueue {
  // TODO: No reason for this to be public
  public events: Map<string, Array<(payload: object) => void>>;
  private oneTimeEvents: Set<string>;

  constructor(events?: Map<string, Array<(payload: object) => void>>) {
    this.events = events || new Map();
    this.oneTimeEvents = new Set([]);
  }

  public trigger(event: string, payload: object) {
    const callbacks = this.events.get(event) || [];
    callbacks.forEach((callback) => {
      callback.call(this, payload);
    });

    this.handleOneTimeEvent(event);
  }

  public when(event: string, callback: (this: void, payload: object) => void) {
    const callbacks = this.events.get(event) || [];
    callbacks.push(callback);
    this.events.set(event, callbacks);
  }

  public once(event: string, callback: (this: void, payload: object) => void) {
    this.when(event, callback);
    this.oneTimeEvents.add(event);
  }

  private handleOneTimeEvent(event: string): void {
    if (this.oneTimeEvents.delete(event)) {
      this.events.delete(event);
    }
  }
}
