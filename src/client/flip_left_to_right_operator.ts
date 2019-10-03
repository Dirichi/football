import { IMAGE_TRANSPOSE_OPERATION_ID } from "../constants";
import { ISpriteImageTransposeOperator } from "../interfaces/isprite_image_transpose_operator";
import { P5AnimationEngine } from "./p5_animation_engine";
import { SpriteImage } from "./sprite_image";

export class FlipLeftToRightOperator implements ISpriteImageTransposeOperator {
  constructor(private engine: P5AnimationEngine) {}

  public apply(image: SpriteImage): Promise<SpriteImage> {
    const transposePrefix = "horizontally_flipped_";
    const fileNameRegex = /\/([a-z0-9_]+)\.png/;
    const flippedImagePath =
      image.getPath().replace(fileNameRegex, `/${transposePrefix}$1.png`);
    return this.engine.loadImage(flippedImagePath).then((flippedImage) => {
      return new SpriteImage(flippedImagePath, flippedImage);
    });
  }

  public getOperationId(): IMAGE_TRANSPOSE_OPERATION_ID {
    return IMAGE_TRANSPOSE_OPERATION_ID.FLIP_LEFT_RIGHT;
  }
}
