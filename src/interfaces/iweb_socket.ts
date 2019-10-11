import { GameRoom } from "../game_room";
import { IParticipationAttributes } from "./iparticipation_attributes";

export interface IWebSocket {
  emit(event: string, message: any): void;
  getId(): string;
  getParticipation(): IParticipationAttributes;
  getGameRoom(): GameRoom;
  on(event: string, callback: (payload: any) => void): void;
}
