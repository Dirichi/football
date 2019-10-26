import { IPlayerAnimationState } from "../../interfaces/iplayer_animation_state";
import { PlayerSprite } from "../player_sprite";

export class PlayerAnimationController {
  private currentState?: IPlayerAnimationState = null;

  constructor(private states: IPlayerAnimationState[]) {}

  public animate(playerSprite: PlayerSprite): void {
    const nextState =
      this.states.find((state) => state.eligibleFor(playerSprite));
    if (this.currentState !== nextState) {
      if (this.currentState) { this.currentState.exit(); }
      nextState.enter(playerSprite);
    }

    this.currentState = nextState;
    this.currentState.animate(playerSprite);
  }
}
