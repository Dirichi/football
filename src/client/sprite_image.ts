import p5 from "p5";
import { IMAGE_TRANSPOSE_OPERATION_ID } from "../constants";
import { ISpriteImageTransposeOperator } from "../interfaces/isprite_image_transpose_operator";

export class SpriteImage {
  private transformations: Map<IMAGE_TRANSPOSE_OPERATION_ID, SpriteImage>;

  constructor(private path: string, private baseImage: p5.Image) {
    this.transformations = new Map([[IMAGE_TRANSPOSE_OPERATION_ID.NONE, this]]);
  }

  public transpose(operationId: IMAGE_TRANSPOSE_OPERATION_ID): SpriteImage {
    const image = this.transformations.get(operationId);
    if (!image) {
      const message =
        `Operation ${operationId} not cached for image ${this.path}`;
      throw new Error(message);
    }
    return image;
  }

  public getBaseImage(): p5.Image {
    return this.baseImage;
  }

  public getPath(): string {
    return this.path;
  }

  public cacheTransposeOperation(
    operator: ISpriteImageTransposeOperator): Promise<void> {
      const cachedTranspose =
        this.transformations.get(operator.getOperationId());
      if (cachedTranspose) { return Promise.resolve(); }

      return operator.apply(this).then((transposedImage) => {
        this.transformations.set(operator.getOperationId(), transposedImage);
      });
  }
}
