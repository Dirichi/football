import { IBoxSchema } from "../src/ibox_schema";

export class Post {
  public x: number;
  public y: number;
  public xlength: number;
  public ylength: number;

  constructor(coordinates: number[]) {
    this.x = coordinates[0];
    this.y = coordinates[1];
    this.xlength = coordinates[2];
    this.ylength = coordinates[3];
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
