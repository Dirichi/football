import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";

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
    const distance = this.distance(player, this.ball);
    const margin = (player.diameter + this.ball.diameter) / 2;

    if (distance > margin) {
      player.moveTowards(this.ball.x, this.ball.y);
    } else {
      player.stop();
    }
  }

  private distance(player: Player, ball: Ball) {
    const xdist = player.x - ball.x;
    const ydist = player.y - ball.y;
    const distance = Math.sqrt((xdist * xdist) + (ydist * ydist));
    return distance;
  }
}
