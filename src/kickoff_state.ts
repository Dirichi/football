export class KickOffState implements IGameState {
  public enter(game: Game) {
    game.disableControls();
  }

  public update(game: Game): IGameState | null {
    if (game.readyForKickOff()) {
      return new PlayState();
    }
    game.prepareForKickOff();
    return null;
  }

  public exit(game: Game) {
    game.enableControls();
  }
}
