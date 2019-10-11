import { Socket } from "socket.io";
import { GameRoom } from "../game_room";
import { IUserAttributes } from "./iuser_attributes";

export interface ICustomizedSocket extends Socket {
  user?: IUserAttributes;
  gameRoom?: GameRoom;
}
