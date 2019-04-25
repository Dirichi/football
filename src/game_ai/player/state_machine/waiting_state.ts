import { COMMANDS } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";

export class WaitingState implements IPlayerState {
  private commandFactory: ICommandFactory;

  constructor(commandFactory: ICommandFactory) {
    this.commandFactory = commandFactory;
  }

  public eligibleFor(player: Player): boolean {
    return player.hasWaitMessages();
  }

  public update(player: Player): void {
    if (!this.eligibleFor(player)) {
      return;
    }

    if (this.waitingNoLongerValidFor(player)) {
      // tslint:disable-next-line:no-console
      console.log("WAITING NO LONGER VALID");
      player.clearWaitMessages();
    } else {
      this.commandFactory
        .getCommand(COMMANDS.STOP)
        .execute(player);
    }
  }

  private waitingNoLongerValidFor(player: Player): boolean {
    return player.hasBall() || !player.teamInControl();
  }
}
