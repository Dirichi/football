import { COMMANDS } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeature } from "../../../interfaces/iplayer_state_feature";

export class ShootingState implements IPlayerState {
  private commandFactory: ICommandFactory;

  constructor(commandFactory: ICommandFactory) {
    this.commandFactory = commandFactory;
  }

  public eligibleFor(features: IPlayerStateFeature): boolean {
    // TODO: Better eligibility function
    return features.hasBall && !features.hasOpenPassingOptions;
  }

  public update(player: Player, features: IPlayerStateFeature): void {
    if (this.eligibleFor(features)) {
      this.commandFactory.getCommand(COMMANDS.SHOOT_BALL).execute(player);
    }
  }
}
