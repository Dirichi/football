import { ANIMATION_ID } from "../constants";
import { IAnimation } from "../interfaces/ianimation";
import { IAnimationConfig } from "../interfaces/ianimation_config";
import { ISpriteImageTransposeOperator } from "../interfaces/isprite_image_transpose_operator";
import { range } from "../utils/helper_functions";
import { P5AnimationEngine } from "./p5_animation_engine";
import { SpriteAnimation } from "./sprite_animation";
import { SpriteImage } from "./sprite_image";

export class AnimationStore {
  constructor(
    private engine: P5AnimationEngine,
    private animationsById: Map<ANIMATION_ID, IAnimation> = new Map([])) { }

  public addAnimation(config: IAnimationConfig): Promise<void> {
    const { basePath, numberOfFrames, extension, transformations } = config;
    const imagePaths = this.getFilePaths(basePath, numberOfFrames, extension);
    const imagesPromise =
      imagePaths.map((path) => this.loadSpriteImage(path, transformations));
    return Promise.all(imagesPromise).then((images) => {
      this.recordAnimation(config, images);
    });
  }

  public getAnimation(id: ANIMATION_ID): IAnimation | null {
    return this.animationsById.get(id) || null;
  }

  private getFilePaths(
    basePath: string, numberOfFrames: number, extension: string): string[] {
      return range(numberOfFrames)
        .map((frameIndex) => `${basePath}${frameIndex + 1}.${extension}`);
  }

  private loadSpriteImage(
    path: string,
    transposeOperators: ISpriteImageTransposeOperator[]): Promise<SpriteImage> {
      return this.engine.loadImage(path).then((image) => {
        const spriteImage = new SpriteImage(path, image);
        const transposeOperationPromises =
          transposeOperators.map((operator) => {
            spriteImage.cacheTransposeOperation(operator);
        });
        return Promise.all(transposeOperationPromises).then((_) => spriteImage);
      });
  }

  private recordAnimation(
    config: IAnimationConfig, spriteImages: SpriteImage[]): void {
      const animation = new SpriteAnimation(
        this.engine, spriteImages, config.loop, config.speed);
      this.animationsById.set(config.id, animation);
  }
}
