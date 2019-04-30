import { STATE_MACHINE_COMMANDS } from "../constants";
import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PassBallCommand implements ICommand {
  // TODO: Trying to implement this class has revealed that the command classes
  // may need to be refactored so that they are instantiated on demand with the
  // arguments that are required for their execution.

  // TODO: Update this class so that it picks based on the directions
  // that the user put in
  private ball: Ball;
  private possessionService: IBallPossessionService;

  constructor(ball: Ball, possessionService: IBallPossessionService) {
    this.ball = ball;
    this.possessionService = possessionService;
  }

  public execute(sender: Player, receiver: Player): void {
    const playerInPossession =
      this.possessionService.getCurrentPlayerInPossessionOrNull();

    if (sender !== playerInPossession || sender.hasRecentlyKickedBall()) {
      return;
    }

    // TODO: This message is only used by the state machine so it may have to
    // be moved out of the command
    sender.sendMessage(receiver, {details: STATE_MACHINE_COMMANDS.WAIT});
    sender.kickBall();
    this.ball.moveTowards(receiver.getPosition());
  }
}
