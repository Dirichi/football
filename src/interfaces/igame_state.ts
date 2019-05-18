import { Game } from "../game";

export interface IGameState {
  enter(game: Game): void;
  update(game: Game): IGameState | null;
  exit(game: Game): void;
}
