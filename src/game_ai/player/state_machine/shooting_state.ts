import { COMMAND_ID } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";

export class ShootingState implements IPlayerState {
  constructor(
    private commandFactory: ICommandFactory,
    private extractor: IPlayerStateFeatureExtractor,
    private shotValueThreshold: number) {}

  public eligibleFor(player: Player): boolean {
    // TODO: Better eligibility function
    return this.extractor.hasBall(player)
      && this.extractor.bestShotValue(player) >= this.shotValueThreshold;
  }

  public update(player: Player): void {
    if (this.eligibleFor(player)) {
      const target = this.extractor.bestShotTargetOption(player);
      this.commandFactory
        .getCommand(COMMAND_ID.SHOOT_BALL)
        .execute(player, target);
    }
  }
}
