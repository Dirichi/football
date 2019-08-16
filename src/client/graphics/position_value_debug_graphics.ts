import { EVENTS } from "../../constants";
import { EventQueue } from "../../event_queue";
import { IAnimationEngine } from "../../interfaces/ianimation_engine";
import { IPositionValueSchema } from "../../interfaces/iposition_value_schema";

export class PositionValueDebugGraphics {
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private positionValueData: IPositionValueSchema[];
  private scale: number[];

  constructor(engine: IAnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.queue = queue;
    this.scale = [0, 0, 1, 1]; // default scale
    this.positionValueData = [];
    this.configureListeners();
  }

  public animate() {
    this.positionValueData.forEach((dataPoint) => {
      this.engine.displayPositionValues(dataPoint);
    });
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.POSITION_VALUE_DEBUG_INFO, (data) => {
      const deserializedData = data as IPositionValueSchema[];
      this.positionValueData = deserializedData.map((dataPoint) => {
        return this.toScale(dataPoint);
      });
    });
  }

  private toScale(data: IPositionValueSchema): IPositionValueSchema {
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;
    const potentialPositionsAndValues =
      data.potentialPositionsAndValues.map((positionAndValue) => {
        return {
          value: positionAndValue.value,
          x: (positionAndValue.x * xrange) + xmin,
          y: (positionAndValue.y * yrange) + ymin,
        };
      });

    return {
      currentPositionX: (data.currentPositionX * xrange) + xmin,
      currentPositionY: (data.currentPositionY * yrange) + ymin,
      potentialPositionsAndValues,
    } as IPositionValueSchema;
  }
}
