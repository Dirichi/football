import { Player } from "../../../game_objects/player";
import { IPlayerController } from "../../../interfaces/iplayer_controller";
import { IPlayerState } from "../../../interfaces/iplayer_state";

export class PlayerStateMachine implements IPlayerController {
  private states: IPlayerState[];
  private player: Player;

  constructor(player: Player, states: IPlayerState[]) {
    this.player = player;
    this.states = states;
  }

  public update() {
    const eligilbleState = this.states.find((state) => state.eligibleFor(this.player));
    eligilbleState.update(this.player);
  }
}
