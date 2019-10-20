import { PLAYER_MESSAGES } from "../constants";
import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { PassTrackerService } from "../stats/pass_tracker_service";

export class PassBallCommand implements ICommand {
  private passTracker: PassTrackerService;

  public setPassTracker(service: PassTrackerService): this {
    this.passTracker = service;
    return this;
  }

  public execute(sender: Player, receiver: Player): void {
    if (sender.kickBall(receiver.getPosition())) {
      this.registerPass(sender, receiver);
      // TODO: This message is only used by the state machine so it may have to
      // be moved out of the command
      sender.sendMessage(receiver, PLAYER_MESSAGES.WAIT);
    }
  }

  private registerPass(sender: Player, receiver: Player): void {
    if (!this.passTracker) { return; }

    this.passTracker.track({
      intendedReceiver: receiver,
      sender,
    });
  }
}
