import { STATE_MACHINE_COMMANDS } from "../constants";
import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PassBallCommand implements ICommand {
  private ball: Ball;

  constructor(ball: Ball) {
    this.ball = ball;
  }

  public execute(sender: Player, receiver: Player): void {
    if (sender.kickBall(this.ball, receiver.getPosition())) {
      // TODO: This message is only used by the state machine so it may have to
      // be moved out of the command
      sender.sendMessage(receiver, {details: STATE_MACHINE_COMMANDS.WAIT});
    }
  }
}
