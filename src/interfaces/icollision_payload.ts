import { Shape } from "../custom_types/types";

export interface ICollisionPayload {
  colliderId: string;
  colliderType: string;
  shape: Shape;
}
