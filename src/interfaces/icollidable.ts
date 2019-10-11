import { Shape } from "../custom_types/types";

export interface ICollidable {
  getGameObjectId(): string;
  getShape(): Shape;
}
