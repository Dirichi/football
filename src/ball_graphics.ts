import { Ball } from "../src/ball";
import { P5AnimationEngine } from "./p5_animation_engine";

export class BallGraphics {
  public engine: P5AnimationEngine;

  constructor(engine: P5AnimationEngine) {
    this.engine = engine;
  }

  public animate(ball: Ball) {
    this.engine.push();
    this.engine.fill(200, 200, 200);
    this.engine.circle(ball.x, ball.y, ball.diameter);
    this.engine.pop();
  }
}
