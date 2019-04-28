import { STATE_MACHINE_COMMANDS } from "../constants";
import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { BallPossessionService } from "../services/ball_possession_service";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PassBallCommand implements ICommand {
  // should this command be able to access the ball directly?
  // or should we listen to it through the event_queue, or have what we
  // need from the ball provided by a service?

  // TODO: Trying to implement this class has revealed that the command classes
  // may need to be refactored so that they are instantiated on demand with the
  // arguments that are required for their execution.

  // TODO: Update this class so that it picks based on the directions
  // that the user put in
  private ball: Ball;
  private possessionService: BallPossessionService;

  constructor(ball: Ball, possessionService: BallPossessionService) {
    this.ball = ball;
    this.possessionService = possessionService;
  }

  public execute(sender: Player, receiver: Player): void {
    if (
      sender !== this.possessionService.getCurrentPlayerInPossessionOrNull()) {
        return;
    }

    // TODO: This message is only used by the state machine so it may have to
    // be moved out of the command
    sender.sendMessage(receiver, {details: STATE_MACHINE_COMMANDS.WAIT});
    sender.kickingBall = true;
    this.ball.moveTowards(receiver.getPosition());
  }
}
