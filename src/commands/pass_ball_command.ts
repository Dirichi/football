import { STATE_MACHINE_COMMANDS } from "../constants";
import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PassBallCommand implements ICommand {
  private ball: Ball;
  private ballPossessionService: IBallPossessionService;

  constructor(ball: Ball, ballPossessionService: IBallPossessionService) {
    this.ball = ball;
    this.ballPossessionService = ballPossessionService;
  }

  public execute(sender: Player, receiver: Player): void {
    const playerInPossession =
      this.ballPossessionService.getCurrentPlayerInPossessionOrNull();

    if (sender !== playerInPossession || sender.ballControlIsDisabled()) {
      return;
    }

    // TODO: This message is only used by the state machine so it may have to
    // be moved out of the command
    sender.sendMessage(receiver, {details: STATE_MACHINE_COMMANDS.WAIT});
    sender.temporarilyDisableBallControl();
    this.ball.moveTowards(receiver.getPosition());
  }
}
