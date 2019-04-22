import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

// The implementation of chasing the ball is not satisfactory
// The player usually stops when they are already on top of the
// ball, which is not how physics should work. Will not fix this
// now as I want to address other things first.

export class ChaseBallCommand implements ICommand {
  // should this command be able to access the ball directly?
  // or should we listen to it through the event_queue?
  private ball: Ball;

  constructor(ball: Ball) {
    this.ball = ball;
  }

  public execute(player: Player) {
    const distance = player.getPosition().distanceTo(this.ball.getPosition());
    const margin = (player.diameter + this.ball.diameter) / 2;

    if (distance > margin) {
      player.moveTowards(this.ball.getPosition());
    } else {
      player.stop();
    }
  }
}
