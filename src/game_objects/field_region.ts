import { IBoxSchema } from "../interfaces/ibox_schema";
import { IFieldRegionSchema } from "../interfaces/ifield_region_schema";
import { Vector3D } from "../three_dimensional_vector";
import { range } from "../utils/helper_functions";
import { Field } from "./field";

export class FieldRegion {

  public static generate(
    field: IBoxSchema, numX: number, numY: number): FieldRegion[] {
      const dimensions = new Vector3D(
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
          return new Vector3D(...coordinates);
        })
        .map((position, id) => {
          return new FieldRegion(id, position, dimensions);
        });
  }

  constructor(
    private id: number,
    private position: Vector3D,
    private dimensions: Vector3D) {
  }

  public getMidPoint(): Vector3D {
    return this.position.add(this.dimensions.scalarMultiply(0.5));
  }

  public serialized(): IFieldRegionSchema {
    return {
      id: this.id,
      x: this.position.x,
      xlength: this.dimensions.x,
      y: this.position.y,
      ylength: this.dimensions.y,
    } as IFieldRegionSchema;
  }
}
