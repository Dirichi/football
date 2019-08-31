import { IPlayerAnimationState } from "../../interfaces/iplayer_animation_state";
import { PlayerSprite } from "../player_sprite";

export class PlayerAnimationController {
  private currentState?: IPlayerAnimationState = null;

  constructor(private states: IPlayerAnimationState[]) {}

  public configure(): void {
    this.states.forEach((state, stateIndex) => {
      const nextState = this.states[stateIndex + 1];
      if (!nextState) { return; }
      state.setNextState(nextState);
    });
  }

  public animate(playerSprite: PlayerSprite): void {
    // This looks a little confusing because one might assume that only state[0]
    // is ever evaluated
    const nextState = this.states[0].animate(playerSprite);
    if (this.currentState && nextState !== this.currentState) {
      this.currentState.exit();
    }

    this.currentState = nextState;
  }
}
