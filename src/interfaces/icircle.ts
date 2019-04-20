import { ThreeDimensionalVector } from "../three_dimensional_vector";

export interface ICircle {
  kind: "circle";
  getCentre(): ThreeDimensionalVector;
  getDiameter(): number;
}
