import { COMMAND_ID, SHOOTING_STATE_SHOT_VALUE_THRESHOLD } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeature } from "../../../interfaces/iplayer_state_feature";

export class ShootingState implements IPlayerState {
  constructor(
    private commandFactory: ICommandFactory,
    private shotValueThreshold: number = SHOOTING_STATE_SHOT_VALUE_THRESHOLD) {
  }

  public eligibleFor(features: IPlayerStateFeature): boolean {
    // TODO: Better eligibility function
    return features.hasBall && features.shotValue >= this.shotValueThreshold;
  }

  public update(player: Player, features: IPlayerStateFeature): void {
    if (this.eligibleFor(features)) {
      this.commandFactory.getCommand(COMMAND_ID.SHOOT_BALL).execute(player);
    }
  }
}
