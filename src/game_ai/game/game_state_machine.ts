import { Game } from "../../game";
import { IGameState } from "../../interfaces/igame_state";
import { IGameStateMachine } from "../../interfaces/igame_state_machine";

export class GameStateMachine implements IGameStateMachine {
  private state: IGameState;
  private enteredInitialState: boolean;

  constructor(initialState: IGameState) {
    this.state = initialState;
    this.enteredInitialState = false;
  }

  public update(game: Game): void {
    this.enterInitialStateIfRequired(game);

    const state = this.state.update(game);
    if (state) {
      this.state.exit(game);
      this.state = state;
      this.state.enter(game);
    }
  }

  public getState(): IGameState {
    return this.state;
  }

  private enterInitialStateIfRequired(game: Game) {
    if (this.enteredInitialState) {
      return;
    }

    this.state.enter(game);
    this.enteredInitialState = true;
  }
}
