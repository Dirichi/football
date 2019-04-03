import { IBoundary } from "../src/iboundary";
import { IBoxSchema } from "../src/ibox_schema";

export class Field implements IBoundary {
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

  // TODO: Perhaps this code doesn't belong here.
  public containsCircle(x: number, y: number, diameter: number): boolean {
    const xLowest = this.x;
    const xHighest = this.x + this.xlength;
    const yLowest = this.y;
    const yHighest = this.y + this.ylength;
    const radius = diameter / 2;

    const withinXBounds = ((x - radius) > xLowest) && ((x + radius) < xHighest);
    const withinYBounds = ((y - radius) > yLowest) && ((y + radius) < yHighest);

    return withinXBounds && withinYBounds;
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
