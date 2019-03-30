export class EventQueue {
  public events: Map<string, Array<(payload: object) => void>>;
  constructor(events?: Map<string, Array<(payload: object) => void>>) {
    this.events = events || new Map();
  }

  public trigger(event: string, payload: object) {
    this.events.get(event).forEach((callback, context) => {
      callback.call(this, payload);
    });
  }

  public when(event: string, callback: (this: void, payload: object) => void) {
    const callbacks = this.events.get(event) || [];
    callbacks.push(callback);
    this.events.set(event, callbacks);
  }
}
