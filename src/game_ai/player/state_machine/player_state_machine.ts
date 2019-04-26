import { STATE_MACHINE_COMMANDS } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { IPlayerController } from "../../../interfaces/iplayer_controller";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { IPlayerStateFeature } from "../../../interfaces/iplayer_state_feature";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";
import { minimumBy } from "../../../utils/helper_functions";

export class PlayerStateMachine implements IPlayerController {
  private states: IPlayerState[];
  private player: Player;
  private messages: string[];
  private extractor: IPlayerStateFeatureExtractor;

  constructor(player: Player, states: IPlayerState[]) {
    this.player = player;
    this.states = states;
    this.messages = [];
  }

  public update() {
    const features = this.stateFeatures();
    const eligibleState = this.states.find(
        (state) => state.eligibleFor(features));
    eligibleState.update(this.player, features);
  }

  public handleMessage(message: {details: string}) {
    const instruction = message.details;

    if (instruction === STATE_MACHINE_COMMANDS.WAIT) {
      this.messages.push(instruction);
      return;
    }

    if (instruction === STATE_MACHINE_COMMANDS.NO_NEED_TO_WAIT) {
      this.clearWaitMessages();
      return;
    }
  }

  public getMessages() {
    return [...this.messages];
  }

  public setFeatureExtractor(extractor: IPlayerStateFeatureExtractor) {
    this.extractor = extractor;
  }

  private stateFeatures(): IPlayerStateFeature {
    return {
      hasBall: this.extractor.hasBall(this.player),
      hasGoodPassingOptions: this.extractor.hasGoodPassingOptions(this.player),
      hasWaitMessages: this.hasWaitMessages(),
      isInGoodShootingPosition: this.extractor.isInGoodShootingPosition(this.player),
      isNearestTeamMateToBall: this.extractor.isNearestTeamMateToBall(this.player),
      teamInControl: this.extractor.teamInControl(this.player),
    };
  }

  private hasWaitMessages(): boolean {
    return this.messages.includes(STATE_MACHINE_COMMANDS.WAIT);
  }

  private clearWaitMessages(): void {
    this.messages = this.messages.filter(
      (message) => message !== STATE_MACHINE_COMMANDS.WAIT);
  }
}
