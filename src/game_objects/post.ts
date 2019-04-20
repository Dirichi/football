import { IBoxSchema } from "../interfaces/ibox_schema";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class Post {
  public x: number;
  public y: number;
  public xlength: number;
  public ylength: number;

  constructor(x: number, y: number, xlength: number, ylength: number) {
    this.x = x;
    this.y = y;
    this.xlength = xlength;
    this.ylength = ylength;
  }

  public getMidPoint(): ThreeDimensionalVector {
    const x = this.x + this.xlength / 2;
    const y = this.y + this.ylength / 2;

    return new ThreeDimensionalVector(x, y, 0);
  }

  public serialized(): IBoxSchema {
    return {
      x: this.x,
      xlength: this.xlength,
      y: this.y,
      ylength: this.ylength,
    } as IBoxSchema;
  }
}
