import { ANIMATION_ID, TEAM_ID } from "../../constants";
import { IAnimation } from "../../interfaces/ianimation";
import { IPlayerAnimationState } from "../../interfaces/iplayer_animation_state";
import { AnimationStore } from "../animation_store";
import { PlayerSprite } from "../player_sprite";

export class KickingState implements IPlayerAnimationState {
  private nextState: IPlayerAnimationState;
  private animation?: IAnimation;

  constructor(private animationStore: AnimationStore) {}

  public animate(sprite: PlayerSprite): IPlayerAnimationState {
    if (!this.animation) { this.initializeAnimation(sprite); }

    if (!sprite.isKicking() && this.nextState) {
      return this.nextState.animate(sprite);
    }

    this.animation.render(sprite);
    return this;
  }

  public setNextState(state: IPlayerAnimationState): void {
    this.nextState = state;
  }

  public exit(): void {
    this.animation.reset();
  }

  private initializeAnimation(sprite: PlayerSprite): void {
    this.animation = sprite.getTeamId() === TEAM_ID.WHITE ?
      this.animationStore.getAnimation(
        ANIMATION_ID.WHITE_PLAYER_KICKING).copy() :
      this.animationStore.getAnimation(ANIMATION_ID.RED_PLAYER_KICKING).copy();
  }
}
