import { Ball } from "../../../game_objects/ball";
import { IBallPossessionService } from "../../../interfaces/iball_possession_service";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";
import { minimumBy } from "../../../utils/helper_functions";
import { Player } from "../../../game_objects/player";

export class PlayerStateFeatureExtractor implements IPlayerStateFeatureExtractor {
  // TODO: Test this class
  private ball: Ball;
  private ballPossessionService: IBallPossessionService;

  constructor(ball: Ball, ballPossessionService: IBallPossessionService) {
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
    return currentPlayerInPossession === player;
  }

  public hasGoodPassingOptions(player: Player): boolean {
    return true;
  }

  public isInGoodShootingPosition(player: Player): boolean {
    return false;
  }

  public isNearestTeamMateToBall(player: Player): boolean {
    const ballPosition = this.ball.getPosition();
    const players = player.getTeam().getPlayers();

    const closestTeamMate = minimumBy(players, (teamMate: Player) => {
      return teamMate.getPosition().distanceTo(ballPosition);
    });

    return closestTeamMate === player;
  }
}
