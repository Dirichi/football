import { SpriteImage } from "../client/sprite_image";
import { IMAGE_TRANSPOSE_OPERATION_ID } from "../constants";

export interface ISpriteImageTransposeOperator {
  apply(image: SpriteImage): Promise<SpriteImage>;
  getOperationId(): IMAGE_TRANSPOSE_OPERATION_ID;
}
