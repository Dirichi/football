import { Game } from "../../game";
import { IGameState } from "../../interfaces/igame_state";

export class ExitState implements IGameState {
  // TODO: Test this class
  public enter(game: Game) {
    game.disableControls();
    game.stopPlayers();
  }

  public update(game: Game): null {
    game.runExitAnimation();
    return null;
  }

  public exit(game: Game) {
    return;
  }
}
