import { Game } from "./game";
import { IGameState } from "./interfaces/igame_state";
import { IGameStateMachine } from "./interfaces/igame_state_machine";

export class GameStateMachine implements IGameStateMachine {
  private state: IGameState;

  constructor(initialState: IGameState) {
    this.state = initialState;
  }

  public update(game: Game) {
    const state = this.state.update(game);
    if (state) {
      this.state.exit(game);
      this.state = state;
      this.state.enter(game);
    }
  }
}
