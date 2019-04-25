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

  // TODO: Rather than having the data that each state object needs from the
  // player bloat the player and team classes, consider implementing these
  // methods in this class, and passing them as a hash into each class
}
