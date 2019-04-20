import { Shape } from "../custom_types/shape";

export interface ICollidable {
  getGameObjectId(): string;
  getShapeData(): Shape;
}
