import { STATE_MACHINE_COMMANDS } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { IPlayerController } from "../../../interfaces/iplayer_controller";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeature } from "../../../interfaces/iplayer_state_feature";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";
import { minimumBy } from "../../../utils/helper_functions";

// TODO: A case could be made to separate the state machine from the concept
// of the controller.
export class PlayerStateMachine implements IPlayerController {
  private states: IPlayerState[];
  private player: Player;
  private messages: string[];
  private extractor: IPlayerStateFeatureExtractor;
  private enabled: boolean;

  constructor(player: Player, states: IPlayerState[]) {
    this.player = player;
    this.states = states;
    this.messages = [];
    this.enabled = true;
  }

  public update() {
    if (!this.enabled) { return; }

    const features = this.getFeatures(this.player);
    const eligibleState = this.states.find(
        (state) => state.eligibleFor(features));
    eligibleState.update(this.player, features);
  }

  public setFeatureExtractor(extractor: IPlayerStateFeatureExtractor) {
    this.extractor = extractor;
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  private getFeatures(player: Player): IPlayerStateFeature {
    return {
      bestPassingOption: this.extractor.bestPassingOption(player),
      bestPositionOption: this.extractor.bestPositionOption(player),
      hasBall: this.extractor.hasBall(player),
      hasWaitMessages: this.extractor.receivedWaitMessage(player),
      isNearestTeamMateToBall: this.extractor.isNearestTeamMateToBall(player),
      shotValue: this.extractor.shotValue(player),
      teamInControl: this.extractor.teamInControl(player),
    };
  }
}
