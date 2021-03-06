import { IPlayerSchema } from "../interfaces/iplayer_schema";
import { PlayerAnimationController } from "./animation_states/player_animation_controller";
import { PlayerSprite } from "./player_sprite";

export class PlayerSpriteManager {
  private locallyControlledSpriteId?: string;

  constructor(
    private animationControllerFactory: () => PlayerAnimationController,
    private spritesById: Map<string, PlayerSprite> = new Map([])) { }

  public createOrUpdate(playerSchema: IPlayerSchema): PlayerSprite {
    const sprite = this.spritesById.get(playerSchema.id);
    if (!sprite) { return this.create(playerSchema); }
    sprite.update(playerSchema);
    return sprite;
  }

  public create(playerSchema: IPlayerSchema): PlayerSprite {
    const animationController = this.animationControllerFactory();
    const sprite = new PlayerSprite(playerSchema, animationController);
    this.spritesById.set(playerSchema.id, sprite);
    return sprite;
  }

  public setLocallyControlledSpriteId(id: string): void {
    this.locallyControlledSpriteId = id;
  }

  public animateAll(): void {
    [...this.spritesById.values()].map((sprite) => this.animate(sprite));
  }

  private animate(sprite: PlayerSprite): void {
    const locallyControlled =
      sprite.getId() === this.locallyControlledSpriteId;
    sprite.setLocallyControlled(locallyControlled).animate();
  }
}
