import { Ball } from "../../../game_objects/ball";
import { BallPossesionService } from "../../../services/ball_possession_servvice";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";
import { minimumBy } from "../../../utils/helper_functions";
import { Player } from "../../../game_objects/player";

export class PlayerStateFeatureExtractor implements IPlayerStateFeatureExtractor {
  // TODO: Test this class
  private ball: Ball;

  constructor(ball: Ball, ballPossessionService: BallPossesionService) {
    this.ball = ball;
    this.ballPossessionService = ballPossessionService;
  }

  public teamInControl(player: Player): boolean {
    const lastPlayerInPossession =
      this.ballPossessionService.getLastPlayerInPossession();
    return lastPlayerInPossession.getTeam() === player.getTeam();
  }

  public hasBall(player: Player): boolean {
    const currentPlayerInPossession =
      this.ballPossessionService.getCurrentPlayerInPossessionOrNull();
    currentPlayerInPossession === player;
  }

  public hasGoodPassingOptions(player: Player): boolean {
    return true;
  }

  public isInGoodShootingPosition(player: Player): boolean {
    const position = player.getPosition();
    const target = player.getOpposingGoalPost().getMidPoint();
    const distanceToGoal = position.distanceTo(target);
    return distanceToGoal < 0.25;
  }

  public isNearestTeamMateToBall(player: Player): boolean {
    const teamMates = player.teamMates();
    const ballPosition = this.ball.getPosition();

    const closestTeamMate = minimumBy(teamMates, (teamMate: Player) => {
      return teamMate.getPosition().distanceTo(ballPosition);
    });

    return closestTeamMate === player;
  }
}
