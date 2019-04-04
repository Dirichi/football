import { EVENTS } from "./constants";
import { EventQueue } from "./event_queue";
import { Field } from "./field";
import { IAnimationEngine } from "./ianimation_engine";
import { IBoxSchema } from "./ibox_schema";

export class HollowBoxGraphics {
  // TODO: implement AnimationEngine interface
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private boxes: IBoxSchema[];
  private scale: number[];

  constructor(engine: IAnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.boxes = [];
    this.queue = queue;
    this.scale = [0, 0, 1, 1];
    this.configureListeners();
  }

  public animate() {
    this.boxes.forEach((box) => this.engine.drawBox(box));
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.BOXES_DATA, (data) => {
      const deserializedData = data as IBoxSchema[];
      this.boxes = deserializedData.map((box) => {
        return this.toScale(box);
      });
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
