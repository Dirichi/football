export interface IProcess {
  send(message: any): void;
  on(event: string, callback: (payload: any) => void): void;
  termintate(): void;
}
