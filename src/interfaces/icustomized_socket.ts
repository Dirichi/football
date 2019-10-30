import { Socket } from "socket.io";
import { GameRoom } from "../game_room";
import { IParticipationAttributes } from "./iparticipation_attributes";

export interface ICustomizedSocket extends Socket {
  gameRoom?: GameRoom;
  participation?: IParticipationAttributes;
}
