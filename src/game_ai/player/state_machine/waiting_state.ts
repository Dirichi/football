import { COMMANDS } from "../../../constants";
import { STATE_MACHINE_COMMANDS } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeature } from "../../../interfaces/iplayer_state_feature";

export class WaitingState implements IPlayerState {
  private commandFactory: ICommandFactory;

  constructor(commandFactory: ICommandFactory) {
    this.commandFactory = commandFactory;
  }

  public eligibleFor(features: IPlayerStateFeature): boolean {
    return features.hasWaitMessages;
  }

  public update(player: Player, features: IPlayerStateFeature): void {
    if (!this.eligibleFor(features)) {
      return;
    }

    if (this.waitingNoLongerValidFor(features)) {
      player.sendMessage(player,
        {details: STATE_MACHINE_COMMANDS.NO_NEED_TO_WAIT});
      return;
    }

    this.commandFactory.getCommand(COMMANDS.STOP).execute(player);
  }

  private waitingNoLongerValidFor(features: IPlayerStateFeature): boolean {
    return features.hasBall || !features.teamInControl;
  }
}
