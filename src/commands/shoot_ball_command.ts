import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { BallPossessionService } from "../services/ball_possession_service";

export class ShootBallCommand implements ICommand {
  // should this command be able to access the ball directly?
  // or should we listen to it through the event_queue, or have what we
  // need from the ball provided by a service?
  private ball: Ball;
  private possessionService: BallPossessionService;

  constructor(ball: Ball, possessionService: BallPossessionService) {
    this.ball = ball;
    this.possessionService = possessionService;
  }

  public execute(player: Player) {
    const owner = this.possessionService.getPlayerInPossession();

    if (owner === player) {
      const post = player.getOpposingGoalPost();
      const midPoint = post.getMidPoint();
      this.ball.moveTowards(midPoint.x, midPoint.y);
    }
  }
}
