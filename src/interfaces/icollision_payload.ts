import { Shape } from "../custom_types/shape";

export interface ICollisionPayload {
  colliderId: string;
  colliderType: string;
  shape: Shape;
}
