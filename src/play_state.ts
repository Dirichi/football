export class PlayState implements IGameState {
  public enter(game: Game) {
    return;
  }

  public update(game: Game): IGameState | null {
    if (game.goalScored()) {
      return new KickOffState();
    }

    return null;
  }

  public exit(game: Game) {
    return null;
  }
}
