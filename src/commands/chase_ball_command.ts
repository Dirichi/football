import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class ChaseBallCommand implements ICommand {
  private ball: Ball;
  private ballPossessionService: IBallPossessionService;

  constructor(ball: Ball, ballPossessionService: IBallPossessionService) {
    this.ball = ball;
    this.ballPossessionService = ballPossessionService;
  }

  public execute(player: Player) {
    const currentPlayerInPossession =
      this.ballPossessionService.getCurrentPlayerInPossessionOrNull();

    if (currentPlayerInPossession !== player) {
      player.moveTowards(this.ball.getPosition());
    } else {
      player.stop();
    }
  }
}
