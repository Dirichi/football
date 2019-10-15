import { COMMAND_ID } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";

export class KeeperState implements IPlayerState {
  constructor(
    private commandFactory: ICommandFactory,
    private extractor: IPlayerStateFeatureExtractor) {
  }

  public eligibleFor(player: Player): boolean {
    return player.isKeeper()
      && !this.extractor.hasBall(player)
      && !this.extractor.isNearestToBall(player);
  }

  public update(player: Player): void {
    if (this.eligibleFor(player)) {
      // TODO: Consider replacing with a method that computes the chances that
      // an opponent might score if they shoot from a certain position,
      // and moving to the position that reduces those chances.
      this.commandFactory.getCommand(COMMAND_ID.GUARD_POST).execute(player);
    }
  }
}
