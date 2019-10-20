import { Player } from "../../../game_objects/player";
import { IPlayerController } from "../../../interfaces/iplayer_controller";
import { IPlayerState } from "../../../interfaces/iplayer_state";

// TODO: A case could be made to separate the state machine from the concept
// of the controller.
export class PlayerStateMachine implements IPlayerController {
  private states: IPlayerState[];
  private enabled: boolean;

  constructor(states: IPlayerState[]) {
    this.states = states;
    this.enabled = true;
  }

  public update(player: Player): void {
    if (!this.enabled) { return; }

    const eligibleState =
      this.states.find((state) => state.eligibleFor(player));
    eligibleState.update(player);
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }
}
