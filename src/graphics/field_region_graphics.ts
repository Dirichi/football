import { EVENTS } from "../constants";
import { EventQueue } from "../event_queue";
import { IAnimationEngine } from "../interfaces/ianimation_engine";
import { IFieldRegionSchema } from "../interfaces/ifield_region_schema";

export class FieldRegionGraphics {
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private regions: IFieldRegionSchema[];
  private scale: number[];

  constructor(engine: IAnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.regions = [];
    this.queue = queue;
    this.scale = [0, 0, 1, 1]; // default scale
    this.configureListeners();
  }

  public animate() {
    this.regions.forEach((region) => this.engine.drawFieldRegion(region));
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.FIELD_REGION_DATA, (data) => {
      const deserializedData = data as IFieldRegionSchema[];
      this.regions = deserializedData.map((region) => this.toScale(region));
    });
  }

  private toScale(data: IFieldRegionSchema): IFieldRegionSchema {
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;

    return {
      id: data.id,
      x: (data.x * xrange) + xmin,
      xlength: (data.xlength * xrange),
      y: (data.y * yrange) + ymin,
      ylength: (data.ylength * yrange),
    } as IFieldRegionSchema;
  }
}
