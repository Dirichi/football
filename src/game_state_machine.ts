import { IGameState } from "../interfaces/igame_state";

export class GameStateMachine {
  private state: IGameState;

  private constructor(initialState: IGameState) {
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
