import { GOAL_ANIMATION_TIME } from "../../constants";
import { Game } from "../../game";
import { IGameState } from "../../interfaces/igame_state";
import { KickOffState } from "./kickoff_state";

export class GoalState implements IGameState {
  // TODO: Test this class
  private animationDuration: number;
  private animationTimer: number;

  constructor(animationDuration?: number) {
    this.animationDuration = animationDuration || GOAL_ANIMATION_TIME;
    this.animationTimer = 0;
  }

  public enter(game: Game): void {
    game.disableControls();
    this.animationTimer = this.animationDuration;
  }

  public update(game: Game): IGameState | null {
    game.runGoalAnimation();
    this.animationTimer -= 1;

    return this.animationTimer === 0 ? new KickOffState() : null;
  }

  public exit(game: Game): void {
    game.enableControls();
  }
}
