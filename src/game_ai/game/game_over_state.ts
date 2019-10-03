import { Game } from "../../game";
import { IGameState } from "../../interfaces/igame_state";

export class GameOverState implements IGameState {
  // TODO: Test this class
  public enter(game: Game) {
    game.disableControls();
    game.stopPlayers();
  }

  public update(game: Game): IGameState | null {
    game.runGameOverAnimation();
    return null;
  }

  public exit(game: Game) {
    return;
  }
}
