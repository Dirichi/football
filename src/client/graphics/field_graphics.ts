import { EVENTS } from "../../constants";
import { EventQueue } from "../../event_queue";
import { Field } from "../../game_objects/field";
import { IAnimationEngine } from "../../interfaces/ianimation_engine";
import { IBoxSchema } from "../../interfaces/ibox_schema";

export class FieldGraphics {
  // TODO: implement AnimationEngine interface
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private field?: IBoxSchema;
  private scale: number[];

  constructor(engine: IAnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.queue = queue;
    this.scale = [0, 0, 1, 1];
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
