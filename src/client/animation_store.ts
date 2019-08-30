import { ANIMATION_ID } from "../constants";
import { IAnimation } from "../interfaces/ianimation";
import { range } from "../utils/helper_functions";
import { IAnimationConfig, P5AnimationEngine } from "./p5_animation_engine";
import { SpriteAnimation } from "./sprite_animation";

export class AnimationStore {
  constructor(
    private engine: P5AnimationEngine,
    private animationsById: Map<ANIMATION_ID, IAnimation> = new Map([])) { }

  public addAnimation(
    id: ANIMATION_ID, config: IAnimationConfig): Promise<void> {
    const imagePaths = this.getFilePaths(config);
    const imagesPromise =
      imagePaths.map((filePath) => this.engine.loadImage(filePath));
    return Promise.all(imagesPromise).then((images) => {
      const animation =
        new SpriteAnimation(this.engine, images, config.loop, config.speed, 0);
      this.animationsById.set(id, animation);
    });
  }

  public getAnimation(id: ANIMATION_ID): IAnimation | null {
    return this.animationsById.get(id) || null;
  }

  private getFilePaths(config: IAnimationConfig): string[] {
    return range(config.numberOfFrames)
      .map((frameIndex) => {
        return `${config.basePath}${frameIndex + 1}.${config.extension}`;
      });
  }
}
