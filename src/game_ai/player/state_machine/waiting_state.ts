import { COMMAND_ID } from "../../../constants";
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
    const waitingNoLongerValid = features.hasBall || !features.teamInControl;
    return features.hasWaitMessages && !waitingNoLongerValid;
  }

  public update(player: Player, features: IPlayerStateFeature): void {
    if (!this.eligibleFor(features)) { return; }

    player.sendMessage(player, {details: STATE_MACHINE_COMMANDS.WAIT});
    this.commandFactory.getCommand(COMMAND_ID.STOP).execute(player);
  }
}
