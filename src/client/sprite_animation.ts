import { IMAGE_TRANSPOSE_OPERATION_ID } from "../constants";
import { IAnimation } from "../interfaces/ianimation";
import { IAnimationEngine } from "../interfaces/ianimation_engine";
import { PlayerSprite } from "./player_sprite";
import { SpriteImage } from "./sprite_image";

export class SpriteAnimation implements IAnimation {
  constructor(
    private engine: IAnimationEngine,
    private images: SpriteImage[],
    private loop: boolean,
    private speed: number,
    private currentIndex: number = 0) {}

  public render(sprite: PlayerSprite): void {
    if (this.currentIndex >= this.images.length) {
      this.currentIndex = this.loop ? 0 : this.images.length - 1;
    }
    this.drawSprite(sprite);
    this.currentIndex += this.speed;
  }

  public reset(): void {
    this.currentIndex = 0;
  }

  public copy(): SpriteAnimation {
    return new SpriteAnimation(
      this.engine, this.images, this.loop, this.speed, this.currentIndex);
  }

  private getTransformation(
    sprite: PlayerSprite): IMAGE_TRANSPOSE_OPERATION_ID {
      return sprite.getVx() >= 0 ? IMAGE_TRANSPOSE_OPERATION_ID.NONE :
        IMAGE_TRANSPOSE_OPERATION_ID.FLIP_LEFT_RIGHT;
  }

  private drawSprite(sprite: PlayerSprite): void {
    const imageIndex = Math.floor(this.currentIndex);
    this.engine.drawImage(
      this.images[imageIndex].transpose(this.getTransformation(sprite)),
      sprite.getX(),
      sprite.getY(),
      sprite.getWidth(),
      sprite.getHeight()
    );
    if (sprite.isLocallyControled()) {
      this.engine.displayPlayerSpriteCursor(sprite.getCursor());
    }
  }
}
