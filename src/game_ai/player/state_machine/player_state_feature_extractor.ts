import { Ball } from "../../../game_objects/ball";
import { Player } from "../../../game_objects/player";
import { IBallPossessionService } from "../../../interfaces/iball_possession_service";
import { IPassValueCalculator } from "../../../interfaces/ipass_value_calculator";
import { IPositionValueCalculator } from "../../../interfaces/iposition_value_calculator";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";
import { IShotValueCalculator } from "../../../interfaces/ishot_value_calculator";
import { ThreeDimensionalVector } from "../../../three_dimensional_vector";
import { maximumBy, minimumBy } from "../../../utils/helper_functions";

export class PlayerStateFeatureExtractor implements IPlayerStateFeatureExtractor {
  private ball: Ball;
  private ballPossessionService: IBallPossessionService;
  private passValueCalculator: IPassValueCalculator;
  private shotValueCalculator: IShotValueCalculator;
  private positionValueCalculator: IPositionValueCalculator;

  constructor(
    ball: Ball,
    ballPossessionService: IBallPossessionService,
    passValueCalculator: IPassValueCalculator,
    shotValueCalculator: IShotValueCalculator,
    positionValueCalculator: IPositionValueCalculator) {
      this.ball = ball;
      this.ballPossessionService = ballPossessionService;
      this.passValueCalculator = passValueCalculator;
      this.shotValueCalculator = shotValueCalculator;
      this.positionValueCalculator = positionValueCalculator;
  }

  public teamInControl(player: Player): boolean {
    const lastPlayerInPossession =
      this.ballPossessionService.getLastPlayerInPossession();

    if (!lastPlayerInPossession) {
      // TODO: Test this behavior
      return false;
    }
    return lastPlayerInPossession.getTeam() === player.getTeam();
  }

  public hasBall(player: Player): boolean {
    return player.hasBall();
  }

  public hasOpenPassingOptions(player: Player): boolean {
    const best = this.bestPassingOption(player);
    // feature extractor shouldn't know that 0 means that the player can't be
    // passed to.
    return this.passValueCalculator.valueFor(best) > 0;
  }

  public bestPassingOption(player: Player): Player {
    return maximumBy(player.teamMates(), (teamMate: Player) => {
      return this.passValueCalculator.valueFor(teamMate);
    });
  }

  public shotValue(player: Player): number {
    return this.shotValueCalculator.evaluate(player);
  }

  public bestPositionOption(player: Player): ThreeDimensionalVector {
    const positionDiffs = [
      new ThreeDimensionalVector(0.1, 0, 0),
      new ThreeDimensionalVector(-0.1, 0, 0),
      new ThreeDimensionalVector(0, 0.1, 0),
      new ThreeDimensionalVector(0, -0.1, 0),
    ];

    const positions = positionDiffs.map((position) => {
      return player.getPosition().add(position);
    });

    return maximumBy(positions, (position) => {
      return this.positionValueCalculator.evaluate(player, position);
    });
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
