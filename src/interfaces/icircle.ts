import { Vector3D } from "../three_dimensional_vector";

export interface ICircle {
  kind: "circle";
  getCentre(): Vector3D;
  getDiameter(): number;
}
