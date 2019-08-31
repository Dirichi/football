import { PlayerSprite } from "../client/player_sprite";

export interface IAnimation {
  render(sprite: PlayerSprite): void;
  reset(): void;
  copy(): IAnimation;
}
