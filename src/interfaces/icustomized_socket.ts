import { Socket } from "socket.io";
import { GameRoom } from "../game_room";
import { User } from "../models/user";

export interface ICustomizedSocket extends Socket {
  user?: User;
  gameRoom?: GameRoom;
}
