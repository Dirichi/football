import { Game } from "../game";

export interface IGameStateMachine {
  update(game: Game): void;
}
