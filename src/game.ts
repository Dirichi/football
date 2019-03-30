import { Ball } from "../src/ball";

export class Game {
  private ball: Ball;

  constructor(ball: Ball) {
    this.ball = ball;
  }
  public animate() {
    this.ball.animate();
  }
}
