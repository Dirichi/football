import { IO_MESSAGE_TYPE } from "../constants";
import { GameRoom } from "../game_room";

export interface IGameClient {
  getId(): string;
  send(messageType: IO_MESSAGE_TYPE, message: any): void;
  when(event: string, callback: (payload: object) => void): void;
}
