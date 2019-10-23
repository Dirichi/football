import { GAME_OVER_ANIMATION_TIME } from "../../constants";
import { Game } from "../../game";
import { IGameState } from "../../interfaces/igame_state";
import { ExitState } from "./exit_state";

export class GameOverState implements IGameState {
  // TODO: Test this class
  private animationDuration: number;
  private animationTimer: number;

  constructor(animationDuration?: number) {
    this.animationDuration = animationDuration || GAME_OVER_ANIMATION_TIME;
  }
  public enter(game: Game) {
    this.animationTimer = this.animationDuration;
    game.disableControls();
    game.stopPlayers();
  }

  public update(game: Game): IGameState | null {
    this.animationTimer -= 1;
    game.runGameOverAnimation();
    return this.animationTimer === 0 ? new ExitState() : null;
  }

  public exit(game: Game) {
    return;
  }
}
