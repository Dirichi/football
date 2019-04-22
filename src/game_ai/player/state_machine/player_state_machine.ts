import { IPlayerController } from "../../../interfaces/iplayer_controller";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { Player } from "../../../game_objects/player";

export class PlayerStateMachine implements IPlayerController {
  private states: IPlayerState[];
  private player: Player;

  constructor(player: Player, states: IPlayerState[]) {
    this.player = player;
    this.states = states;
  }

  public update() {
    const state = this.states.find((state) => state.eligibleFor(player));
    state.update(player);
  }
}
