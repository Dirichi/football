import { IBoxSchema } from "../interfaces/ibox_schema";
import { IFieldRegionSchema } from "../interfaces/ifield_region_schema";
import { ThreeDimensionalVector } from "../three_dimensional_vector";
import { range } from "../utils/helper_functions";
import { Field } from "./field";

export class FieldRegion {

  public static generate(
    field: IBoxSchema, numX: number, numY: number): FieldRegion[] {
      const dimensions =
        new ThreeDimensionalVector(
          field.xlength / numX,
          field.ylength / numY,
          0
        );
      const numRegions = numX * numY;

      return range(numRegions)
        .map((index) => {
          const xpos = field.x + (Math.floor(index / numY) * dimensions.x);
          const ypos = field.y + ((index % numY) * dimensions.y);
          return [xpos, ypos, 0];
        })
        .map((coordinates: [number, number, number]) => {
          return new ThreeDimensionalVector(...coordinates);
        })
        .map((position, id) => {
          return new FieldRegion(id, position, dimensions);
        });
  }

  private id: number;
  private position: ThreeDimensionalVector;
  private dimensions: ThreeDimensionalVector;

  constructor(
    id: number, position: ThreeDimensionalVector,
    dimensions: ThreeDimensionalVector) {
      this.id = id;
      this.position = position;
      this.dimensions = dimensions;
  }

  public getMidPoint(): ThreeDimensionalVector {
    return this.position.add(this.dimensions.scalarMultiply(0.5));
  }

  public serialized() {
    return {
      id: this.id,
      x: this.position.x,
      xlength: this.dimensions.x,
      y: this.position.y,
      ylength: this.dimensions.y,
    } as IFieldRegionSchema;
  }
}
