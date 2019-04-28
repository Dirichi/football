import { COMMANDS } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeature } from "../../../interfaces/iplayer_state_feature";

export class PassingState implements IPlayerState {
  private commandFactory: ICommandFactory;

  constructor(commandFactory: ICommandFactory) {
    this.commandFactory = commandFactory;
  }

  public eligibleFor(features: IPlayerStateFeature): boolean {
    // TODO: address duplication between command and state by reusing the command's
    // validation in the state
    return features.hasBall && features.hasOpenPassingOptions;
  }

  public update(player: Player, features: IPlayerStateFeature): void {
    if (this.eligibleFor(features)) {
      this.commandFactory
        .getCommand(COMMANDS.PASS_BALL)
        .execute(player, features.bestPassingOption);
    }
  }
}
