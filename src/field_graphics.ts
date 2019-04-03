import { constants, EVENTS } from "./constants";
import { EventQueue } from "./event_queue";
import { Field } from "./field";
import { IBoxSchema } from "./ibox_schema";
import { P5AnimationEngine } from "./p5_animation_engine";

export class FieldGraphics {
  // TODO: implement AnimationEngine interface
  public engine: P5AnimationEngine;
  public queue: EventQueue;

  private field?: IBoxSchema;
  private scale?: number[];

  constructor(engine: P5AnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.queue = queue;
    this.configureListeners();
  }

  public animate() {
    // Don't push / pop on the field so that it can perpetually be drawn
    // over hollow elements.
    if (this.field) {
      this.engine.fill(0, 0, 0);
      this.engine.rectangle(this.field.x, this.field.y, this.field.xlength,
        this.field.ylength);
      this.animateCenterCircle();
      this.animateHalfWayLine();
    }
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private animateCenterCircle() {
    this.engine.push();
    this.engine.stroke(255, 255, 255);
    this.engine.strokeWeight(4);
    const midPointX = this.field.x + (this.field.xlength / 2);
    const midPointY = this.field.y + (this.field.ylength / 2);
    const diameter =
      this.field.xlength * constants.CENTER_CIRCLE_DIAMETER_TO_FIELD_XLENGTH;
    this.engine.circle(midPointX, midPointY, diameter);
    this.engine.pop();
  }

  private animateHalfWayLine() {
    this.engine.push();
    this.engine.stroke(255, 255, 255);
    this.engine.strokeWeight(4);
    const midPointX = this.field.x + (this.field.xlength / 2);
    this.engine.line(
      midPointX, this.field.y, midPointX, (this.field.y + this.field.ylength));
    this.engine.pop();
  }

  private configureListeners() {
    this.queue.when(EVENTS.FIELD_DATA, (data) => {
      const deserializedData = data as IBoxSchema;
      this.field = this.toScale(deserializedData);
    });
  }

  private toScale(data: IBoxSchema): IBoxSchema {
    // TODO: Should scaling the gameObject also be a job of the serializer?
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;

    return {
      x: (data.x * xrange) + xmin,
      xlength: (data.xlength * xrange),
      y: (data.y * yrange) + ymin,
      ylength: (data.ylength * yrange),
    } as IBoxSchema;
  }
}
