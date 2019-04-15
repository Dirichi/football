import { Player } from "./player";

export interface ICommand {
  execute(player: Player): void;
}
