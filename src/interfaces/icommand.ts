import { Player } from "../game_objects/player";

export interface ICommand {
  execute(player: Player, ...args: any[]): void;
}
