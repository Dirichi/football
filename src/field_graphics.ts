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
    if (this.field) {
      this.engine.drawField(this.field);
    }
  }

  public setScale(scale: number[]) {
    this.scale = scale;
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
