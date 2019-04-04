import { EVENTS } from "./constants";
import { EventQueue } from "./event_queue";
import { IAnimationEngine } from "./ianimation_engine";
import { IBallSchema } from "./iball_schema";

export class BallGraphics {
  public engine: IAnimationEngine;
  public queue: EventQueue;

  private ball?: IBallSchema;
  private scale: number[];

  constructor(engine: IAnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.queue = queue;
    this.scale = [0, 0, 1, 1]; // default scale
    this.configureListeners();
  }

  public animate() {
    if (this.ball) {
      this.engine.drawBall(this.ball);
    }
  }

  public setScale(scale: number[]) {
    this.scale = scale;
  }

  private configureListeners() {
    this.queue.when(EVENTS.BALL_DATA, (data) => {
      const deserializedData = data as IBallSchema;
      this.ball = this.toScale(deserializedData);
    });
  }

  private toScale(data: IBallSchema): IBallSchema {
    const [xmin, ymin, xmax, ymax] = this.scale;
    const xrange = xmax - xmin;
    const yrange = ymax - ymin;

    return {
      diameter: (data.diameter * yrange),
      vx: data.vx * xrange,
      vy: data.vy * yrange,
      x: (data.x * xrange) + xmin,
      y: (data.y * yrange) + ymin,
    } as IBallSchema;
  }
}
