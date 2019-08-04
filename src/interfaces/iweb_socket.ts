import { Participation } from "../models/participation";

export interface IWebSocket {
  emit(event: string, message: any): void;
  getId(): string;
  getParticipation(): Participation;
  on(event: string, callback: (payload: any) => void): void;
}
