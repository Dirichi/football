import { PLAYER_MESSAGES } from "../constants";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";

export class PassBallCommand implements ICommand {
  public execute(sender: Player, receiver: Player): void {
    if (sender.kickBall(receiver.getPosition())) {
      // TODO: This message is only used by the state machine so it may have to
      // be moved out of the command
      sender.sendMessage(receiver, PLAYER_MESSAGES.WAIT);
    }
  }
}
