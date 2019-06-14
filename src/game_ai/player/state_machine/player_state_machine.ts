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

  public update(): void {
    if (!this.enabled) { return; }

    const features = this.getFeatures();
    const eligibleState = this.states.find(
        (state) => state.eligibleFor(features));
    eligibleState.update(this.player, features);
  }

  public handleMessage(message: {details: string}): void {
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

  public getMessages(): string[] {
    return [...this.messages];
  }

  public setFeatureExtractor(extractor: IPlayerStateFeatureExtractor): void {
    this.extractor = extractor;
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  private getFeatures(): IPlayerStateFeature {
    return {
      bestPassingOption: this.extractor.bestPassingOption(this.player),
      hasBall: this.extractor.hasBall(this.player),
      hasOpenPassingOptions: this.extractor.hasOpenPassingOptions(this.player),
      hasWaitMessages: this.hasWaitMessages(),
      isNearestTeamMateToBall: this.extractor.isNearestTeamMateToBall(this.player),
      shotValue: this.extractor.shotValue(this.player),
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
