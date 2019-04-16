import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { BallPossessionService } from "../services/ball_possession_service";

export class PassBallCommand implements ICommand {
  // should this command be able to access the ball directly?
  // or should we listen to it through the event_queue, or have what we
  // need from the ball provided by a service?

  // TODO: Trying to implement this class has revealed that the command classes
  // may need to be refactored so that they are instantiated on demand with the
  // arguments that are required for their execution.

  // TODO: Update this class to pick from the options list of players
  // intelligently
  private ball: Ball;
  private possessionService: BallPossessionService;
  private options: Player[];

  constructor(ball: Ball, possessionService: BallPossessionService, options: Player[]) {
    this.ball = ball;
    this.possessionService = possessionService;
    this.options = options;
  }

  public execute(sender: Player) {
    const receiver = this.options[0];
    const owner = this.possessionService.getPlayerInPossession();

    if (receiver && owner === sender) {
      this.ball.moveTowards(receiver.x, receiver.y);
    }
  }
}
