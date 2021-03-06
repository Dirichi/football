import { Game } from "../../game";
import { IGameState } from "../../interfaces/igame_state";
import { GameOverState } from "./game_over_state";
import { GoalState } from "./goal_state";

export class PlayState implements IGameState {
  // TODO: Test this class
  public enter(game: Game) {
    game.enableControls();
  }

  public update(game: Game): IGameState | null {
    if (game.isOver()) { return new GameOverState(); }

    game.runPlayAnimation();
    return game.goalScored() ? new GoalState() : null;
  }

  public exit(game: Game) {
    return;
  }
}
