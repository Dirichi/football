import { PlayerSprite } from "../client/player_sprite";

export interface IPlayerAnimationState {
  animate(schema: PlayerSprite): IPlayerAnimationState;
  setNextState(state: IPlayerAnimationState): void;
  exit(): void;
}
