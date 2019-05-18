import { KICKOFF_ANIMATION_TIME } from "../../constants";
import { Game } from "../../game";
import { IGameState } from "../../interfaces/igame_state";
import { PlayState } from "./play_state";

export class KickOffState implements IGameState {
  private animationTimer: number;

  public constructor() {
    this.animationTimer = 0;
  }

  public enter(game: Game): void {
    this.animationTimer = KICKOFF_ANIMATION_TIME;
    game.disableControls();
    game.prepareForKickOff();
  }

  public update(game: Game): IGameState | null {
    game.runKickOffAnimation();
    this.animationTimer -= 1;
    return this.animationTimer === 0 ? new PlayState() : null;
  }

  public exit(game: Game): void {
    game.enableControls();
  }
}
