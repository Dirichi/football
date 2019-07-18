import { IBoxSchema } from "../interfaces/ibox_schema";
import { Vector3D } from "../three_dimensional_vector";
import { Ball } from "./ball";

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

  public getMidPoint(): Vector3D {
    const x = this.x + this.xlength / 2;
    const y = this.y + this.ylength / 2;

    return new Vector3D(x, y, 0);
  }

  public distanceTo(point: Vector3D): number {
    return this.getMidPoint().distanceTo(point);
  }

  // TODO: It feels disatisfactory that there's a collision notification
  // service and this piece of code is here. Will change this to use that
  // service later.
  public containsBall(ball: Ball): boolean {
    return this.containsPoint(ball.getPosition());
  }

  // TODO: Duplication betwen field and post. Consider consolidating.
  public containsPoint(point: Vector3D): boolean {
    const withinXBounds =
      this.x < point.x && point.x < (this.x  + this.xlength);
    const withinYBounds =
      this.y < point.y && point.y < (this.y  + this.ylength);

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
