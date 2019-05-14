export class GoalState implements IGameState {
  private goalCelebrationTimer: number;

  constructor() {
    this.goalCelebrationTimer = 0;
  }

  public enter(game: Game): void {
    game.disableControls();
    this.goalCelebrationTimer = 5000;
  }

  public update(game: Game): Game | null {
    if (this.goalCelebrationTimer === 0) {
      return new KickOffState();
    }
    game.displayGoalCelebrationAnimation();
    this.goalCelebrationTimer -= 1;
  }

  public exit(game: Game) {
    game.enableControls();
  }
}
