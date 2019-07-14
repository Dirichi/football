import { COMMAND_ID } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";

export class AttackingRunState implements IPlayerState {
  constructor(
    private commandFactory: ICommandFactory,
    private extractor: IPlayerStateFeatureExtractor) {
  }

  public eligibleFor(player: Player): boolean {
    return this.extractor.teamInControl(player)
      && !this.extractor.hasBall(player);
  }

  public update(player: Player): void {
    if (this.eligibleFor(player)) {
      player.moveTowards(this.extractor.bestPositionOption(player));
    }
  }
}
