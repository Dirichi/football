import { POSITION_DELTA_FOR_POSITION_VALUE_CALCULATION } from "../../../constants";
import { Ball } from "../../../game_objects/ball";
import { Player } from "../../../game_objects/player";
import { IBallPossessionService } from "../../../interfaces/iball_possession_service";
import { IDribblingValueCalculator } from "../../../interfaces/idribbling_value_calculator";
import { IPassValueCalculator } from "../../../interfaces/ipass_value_calculator";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";
import { IPositionValueCalculator } from "../../../interfaces/iposition_value_calculator";
import { IShotValueCalculator } from "../../../interfaces/ishot_value_calculator";
import { Vector3D } from "../../../three_dimensional_vector";
import { maximumBy, minimumBy } from "../../../utils/helper_functions";

export class PlayerStateFeatureExtractor implements IPlayerStateFeatureExtractor {
  constructor(
    private ball: Ball,
    private ballPossessionService: IBallPossessionService,
    private passValueCalculator: IPassValueCalculator,
    private shotValueCalculator: IShotValueCalculator,
    private positionValueCalculator: IPositionValueCalculator,
    private dribblingValueCalculator: IDribblingValueCalculator) {
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

  public bestPassingOption(player: Player): Player {
    return maximumBy(player.teamMates(), (teamMate) => {
      return this.passValueCalculator.evaluate(teamMate);
    });
  }

  public shouldDribble(player: Player): boolean {
    return this.bestPositionedTeammateValue(player) < this.bestDribbleValue(player);
  }

  public bestPassValue(player: Player): number {
    const bestPassOption = this.bestPassingOption(player);
    return this.passValueCalculator.evaluate(bestPassOption);
  }

  public bestPositionOption(player: Player): Vector3D {
    const positions = this.potentialPositions(player);

    return maximumBy(positions, (position) => {
      return this.positionValueCalculator.evaluate(player, position);
    });
  }

  public bestDribblingOption(player: Player): Vector3D {
    const positions = this.potentialPositions(player);

    return maximumBy(positions, (position) => {
      return this.dribblingValueCalculator.evaluate(player, position);
    });
  }

  public bestDribbleValue(player: Player): number {
    const bestDribblingOption = this.bestDribblingOption(player);
    return this.dribblingValueCalculator.evaluate(player, bestDribblingOption);
  }

  public shotValue(player: Player): number {
    return this.shotValueCalculator.evaluate(player);
  }

  public isNearestTeamMateToBall(player: Player): boolean {
    const ballPosition = this.ball.getPosition();
    const players = player.getTeam().getPlayers();

    const closestTeamMate = minimumBy(players, (teamMate: Player) => {
      return teamMate.getPosition().distanceTo(ballPosition);
    });

    return closestTeamMate === player;
  }

  private bestPositionedTeammateValue(player: Player): number {
    const positionValues = player.teamMates().map((mate) => {
      return this.positionValueCalculator.evaluate(
        mate, mate.getPosition(), true);
    });

    return Math.max(...positionValues);
  }

  private potentialPositions(player: Player): Vector3D[] {
    const delta = POSITION_DELTA_FOR_POSITION_VALUE_CALCULATION;
    const positionDiffs = [
      new Vector3D(delta, 0, 0),
      new Vector3D(-delta, 0, 0),
      new Vector3D(0, delta, 0),
      new Vector3D(0, -delta, 0),
      new Vector3D(0, 0, 0),
    ];

    return positionDiffs.map((position) => {
      return player.getPosition().add(position);
    });
  }
}
