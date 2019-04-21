import { IBoxSchema } from "../interfaces/ibox_schema";
import { IFieldRegionSchema } from "../interfaces/ifield_region_schema";
import { ThreeDimensionalVector } from "../three_dimensional_vector";
import { range } from "../utils/helper_functions";
import { Field } from "./field";

export class FieldRegion {

  public static generate(
    field: IBoxSchema, numX: number, numY: number): FieldRegion[] {
      const xlength = field.xlength / numX;
      const ylength = field.ylength / numY;
      const numRegions = numX * numY;

      return range(numRegions)
        .map((index) => {
          const xpos = field.x + (Math.floor(index / numY) * xlength);
          const ypos = field.y + ((index % numY) * ylength);
          return [xpos, ypos, 0];
        })
        .map((coordinates: [number, number, number]) => {
          return new ThreeDimensionalVector(...coordinates);
        })
        .map((position, id) => {
          return new FieldRegion(id, position, xlength, ylength);
        });
  }

  private id: number;
  private position: ThreeDimensionalVector;
  private xlength: number;
  private ylength: number;

  constructor(
    id: number, position: ThreeDimensionalVector, xlength: number,
    ylength: number) {
      this.id = id;
      this.position = position;
      this.xlength = xlength;
      this.ylength = ylength;
  }

  public serialized() {
    return {
      id: this.id,
      x: this.position.x,
      xlength: this.xlength,
      y: this.position.y,
      ylength: this.ylength,
    } as IFieldRegionSchema;
  }
}
