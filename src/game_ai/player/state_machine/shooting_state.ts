import { COMMAND_ID, SHOOTING_STATE_SHOT_VALUE_THRESHOLD } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";

export class ShootingState implements IPlayerState {
  constructor(
    private commandFactory: ICommandFactory,
    private extractor: IPlayerStateFeatureExtractor,
    private shotValueThreshold: number = SHOOTING_STATE_SHOT_VALUE_THRESHOLD) {}

  public eligibleFor(player: Player): boolean {
    // TODO: Better eligibility function
    return this.extractor.hasBall(player)
      && this.extractor.shotValue(player) >= this.shotValueThreshold;
  }

  public update(player: Player): void {
    if (this.eligibleFor(player)) {
      this.commandFactory.getCommand(COMMAND_ID.SHOOT_BALL).execute(player);
    }
  }
}
