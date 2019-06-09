import { STATE_MACHINE_COMMANDS } from "../constants";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class PassBallCommand implements ICommand {
  public execute(sender: Player, receiver: Player): void {
    if (sender.kickBall(receiver.getPosition())) {
      // TODO: This message is only used by the state machine so it may have to
      // be moved out of the command
      sender.sendMessage(receiver, {details: STATE_MACHINE_COMMANDS.WAIT});
    }
  }
}
