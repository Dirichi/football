import { GameRoom } from "../game_room";
import { Participation } from "../models/participation";

export interface IWebSocket {
  emit(event: string, message: any): void;
  getId(): string;
  getParticipation(): Participation;
  getGameRoom(): GameRoom;
  on(event: string, callback: (payload: any) => void): void;
}
