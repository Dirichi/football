import { COMMAND_ID } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";

export class PassingState implements IPlayerState {
  constructor(
    private commandFactory: ICommandFactory,
    private extractor: IPlayerStateFeatureExtractor) {
  }

  public eligibleFor(player: Player): boolean {
    // TODO: address duplication between command and state by reusing the
    // command's validation in the state
    return this.extractor.hasBall(player);
  }

  public update(player: Player): void {
    if (this.eligibleFor(player)) {
      this.commandFactory
        .getCommand(COMMAND_ID.PASS_BALL)
        .execute(player, this.extractor.bestPassingOption(player));
    }
  }
}
