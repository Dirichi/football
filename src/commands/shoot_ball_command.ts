import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { ICommand } from "../interfaces/icommand";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export class ShootBallCommand implements ICommand {
  private ball: Ball;
  private possessionService: IBallPossessionService;

  constructor(ball: Ball, possessionService: IBallPossessionService) {
    this.ball = ball;
    this.possessionService = possessionService;
  }

  public execute(player: Player) {
    const owner = this.possessionService.getCurrentPlayerInPossessionOrNull();
    if (owner !== player || player.ballControlIsDisabled()) {
      return;
    }

    const postMidPoint = player.getOpposingGoalPost().getMidPoint();
    player.temporarilyDisableBallControl();
    this.ball.moveTowards(postMidPoint);
  }
}
