import { ANIMATION_ID, TEAM_ID } from "../../constants";
import { IAnimation } from "../../interfaces/ianimation";
import { IPlayerAnimationState } from "../../interfaces/iplayer_animation_state";
import { AnimationStore } from "../animation_store";
import { PlayerSprite } from "../player_sprite";

export class IdleState implements IPlayerAnimationState {
  private animation?: IAnimation;

  constructor(private animationStore: AnimationStore) {}

  public enter(sprite: PlayerSprite): void {
    if (!this.animation) { this.initializeAnimation(sprite); }
  }

  public eligibleFor(sprite: PlayerSprite): boolean {
    return !sprite.isMoving();
  }

  public animate(sprite: PlayerSprite): void {
    if (!this.eligibleFor(sprite)) { return; }
    this.animation.render(sprite);
  }

  public exit(): void {
    this.animation.reset();
  }

  private initializeAnimation(sprite: PlayerSprite): void {
    this.animation = sprite.getTeamId() === TEAM_ID.WHITE ?
      this.animationStore.getAnimation(ANIMATION_ID.WHITE_PLAYER_IDLE).copy() :
      this.animationStore.getAnimation(ANIMATION_ID.RED_PLAYER_IDLE).copy();
  }
}
