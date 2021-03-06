import { ANIMATION_ID, SOUND_ID, TEAM_ID } from "../../constants";
import { IAnimation } from "../../interfaces/ianimation";
import { IPlayerAnimationState } from "../../interfaces/iplayer_animation_state";
import { AnimationStore } from "../animation_store";
import { PlayerSprite } from "../player_sprite";
import { SoundPlayer } from "../sound_player";

export class KickingState implements IPlayerAnimationState {
  private animation?: IAnimation;

  constructor(
    private animationStore: AnimationStore,
    private soundPlayer: SoundPlayer) { }

  public animate(sprite: PlayerSprite): void {
    if (!this.eligibleFor(sprite)) { return; }
    this.animation.render(sprite);
  }

  public eligibleFor(sprite: PlayerSprite): boolean {
    return sprite.isKicking();
  }

  public enter(sprite: PlayerSprite): void {
    if (!this.animation) { this.initializeAnimation(sprite); }
    this.soundPlayer.play(SOUND_ID.KICK);
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
