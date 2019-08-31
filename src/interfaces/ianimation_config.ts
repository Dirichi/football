import { ANIMATION_ID } from "../constants";
import { ISpriteImageTransposeOperator } from "./isprite_image_transpose_operator";

export interface IAnimationConfig {
  id: ANIMATION_ID;
  basePath: string;
  numberOfFrames: number;
  extension: string;
  speed: number;
  loop: boolean;
  transformations: ISpriteImageTransposeOperator[];
}
