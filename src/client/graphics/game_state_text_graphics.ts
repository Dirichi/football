import { EVENTS } from "../../constants";
import { EventQueue } from "../../event_queue";
import { IAnimationEngine } from "../../interfaces/ianimation_engine";
import { ITextSchema } from "../../interfaces/itext_schema";

export class GameStateTextGraphics {
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private text: ITextSchema;
  private scale: number[];

  constructor(engine: IAnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.queue = queue;
    this.scale = [0, 0, 1, 1]; // default scale
    this.configureListeners();
  }

  public animate() {
    if (this.text && this.text.value) {
      this.engine.displayText(this.text);
    }
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.GAME_STATE_TEXT_DATA, (data) => {
      const deserializedData = data as ITextSchema;
      this.text = this.toScale(deserializedData);
    });
  }

  private toScale(data: ITextSchema): ITextSchema {
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;

    return {
      value: data.value,
      x: (data.x * xrange) + xmin,
      y: (data.y * yrange) + ymin,
    } as ITextSchema;
  }
}
