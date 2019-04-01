import { constants } from "../src/constants";
import { EventQueue } from "../src/event_queue";
import { IBallSchema } from "../src/iball_schema";
import { P5AnimationEngine } from "./p5_animation_engine";

export class BallGraphics {
  public engine: P5AnimationEngine;
  public queue: EventQueue;

  private ball?: IBallSchema;

  constructor(engine: P5AnimationEngine, queue: EventQueue) {
    this.engine = engine;
    this.queue = queue;
    this.configureListeners();
  }

  public animate() {
    if (this.ball) {
      this.engine.push();
      this.engine.fill(200, 200, 200);
      this.engine.circle(this.ball.x, this.ball.y, this.ball.diameter);
      this.engine.pop();
    }
  }

  private configureListeners() {
    this.queue.when("ball.data", (data) => {
      const deserializedData = data as IBallSchema;
      this.ball = deserializedData;
    });
  }
}
