export interface IWebSocket {
  emit(event: string, message: any): void;
  on(event: string, callback: (payload: any) => void): void;
}
