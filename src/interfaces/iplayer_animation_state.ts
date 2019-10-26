import { PlayerSprite } from "../client/player_sprite";

export interface IPlayerAnimationState {
  animate(schema: PlayerSprite): void;
  enter(sprite: PlayerSprite): void;
  eligibleFor(sprite: PlayerSprite): boolean;
  exit(): void;
}
