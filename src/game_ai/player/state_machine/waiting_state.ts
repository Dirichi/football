import { COMMAND_ID } from "../../../constants";
import { PLAYER_MESSAGES } from "../../../constants";
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
    if (!this.eligibleFor(player)) {
      return;
     }

    // We do not use `waitingStillValid` in `eligibleFor` because we would
    // have to do work in the eligibility function
    // (i.e. clear messages if waiting is not valid). If we did not do that work
    // in the eligibility function and handled it in the update function, we
    // would get a bug where players continuously wait whenever
    // `waitingStillValid` is true, because we would never get to clear the old
    // wait messages.
    if (this.waitingNoLongerValid(player)) {
      player.clearMessagesByTitle(PLAYER_MESSAGES.WAIT);
      return;
    }

    this.commandFactory.getCommand(COMMAND_ID.STOP).execute(player);
  }

  private waitingNoLongerValid(player: Player): boolean {
    return this.extractor.expectedPassInterceptedOrCompleted(player);
  }
}
