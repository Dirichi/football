import { IO_MESSAGE_TYPE } from "../constants";
import { GameRoom } from "../game_room";

export interface IGameClient {
  send(messageType: IO_MESSAGE_TYPE, message: any): void;
  setRoom(room: GameRoom): void;
}
