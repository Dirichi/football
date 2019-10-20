import { Player } from "../game_objects/player";

export interface IPass {
  sender: Player;
  isSuccessful?: boolean;
  intendedReceiver: Player;
  eventualReceiver?: Player;
}
