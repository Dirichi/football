import { COMMAND_ID } from "../../../constants";
import { STATE_MACHINE_COMMANDS } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";

export class WaitingState implements IPlayerState {
  constructor(
    private commandFactory: ICommandFactory,
    private extractor: IPlayerStateFeatureExtractor) {
  }

  public eligibleFor(player: Player): boolean {
    return this.extractor.receivedWaitMessage(player);
  }

  public update(player: Player): void {
    if (!this.eligibleFor(player)) { return; }

    // TODO: Document this behavior or test it: Why can't this exot condition
    // be added to the eligibility check?.
    if (this.waitingNoLongerValid(player)) {
      player.clearMessage(STATE_MACHINE_COMMANDS.WAIT);
      return;
    }

    this.commandFactory.getCommand(COMMAND_ID.STOP).execute(player);
  }

  private waitingNoLongerValid(player: Player): boolean {
    return this.extractor.hasBall(player) || !this.extractor.teamInControl(player);
  }
}
