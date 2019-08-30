import { Player } from "../../../game_objects/player";
import { IPlayerController } from "../../../interfaces/iplayer_controller";
import { IPlayerState } from "../../../interfaces/iplayer_state";

// TODO: A case could be made to separate the state machine from the concept
// of the controller.
export class PlayerStateMachine implements IPlayerController {
  private states: IPlayerState[];
  private player: Player;
  private enabled: boolean;

  constructor(player: Player, states: IPlayerState[]) {
    this.player = player;
    this.states = states;
    this.enabled = true;
  }

  public update(): void {
    if (!this.enabled) { return; }

    const eligibleState =
      this.states.find((state) => state.eligibleFor(this.player));
    eligibleState.update(this.player);
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }
}
