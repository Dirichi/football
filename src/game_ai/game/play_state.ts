import { Game } from "../../game";
import { IGameState } from "../../interfaces/igame_state";
import { GoalState } from "./goal_state";

export class PlayState implements IGameState {
  public enter(game: Game) {
    game.enableControls();
  }

  public update(game: Game): IGameState | null {
    if (game.goalScored()) {
      return new GoalState();
    }
    game.runPlayAnimation();
    return null;
  }

  public exit(game: Game) {
    return;
  }
}
