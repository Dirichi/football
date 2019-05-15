import { IGameState } from "../../src/interfaces/igame_state";
import { Game } from "../../src/game";

export class TestGameState implements IGameState {
  public enter(game: Game): void {
    return;
  }

  public update(game: Game): IGameState | null {
    return new TestGameState();
  }

  public exit(game: Game): void {
    return;
  }
}
