export interface IWebSocket {
  getId(): string;
  emit(event: string, message: any): void;
  on(event: string, callback: (payload: any) => void): void;
}
