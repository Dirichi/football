import { IBoundary } from "../interfaces/iboundary";
import { IBoxSchema } from "../interfaces/ibox_schema";

export class Field implements IBoundary {
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

  // TODO: Perhaps this method doesn't belong here.
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
