export interface IEventQueue {
  trigger(event: string, message: any): void;
  when(event: string, callback: (payload: any) => void): void;
  once(event: string, callback: (payload: any) => void): void;
}
