import { MARKING_MARGIN } from "../../../../constants";
import { Ball } from "../../../../game_objects/ball";
import { Field } from "../../../../game_objects/field";
import { Player } from "../../../../game_objects/player";
import { Vector3D } from "../../../../three_dimensional_vector";
import { distanceAheadOfBall } from "../../../../utils/game_functions";
import { minimumBy, scale } from "../../../../utils/helper_functions";
import { CongestionCalculator } from "./congestion_calculator";

export class DefenceValueCalculator {
  constructor(
    private ball: Ball,
    private field: Field,
    private congestionCalculator: CongestionCalculator,
    private markingMargin: number = MARKING_MARGIN) {}

  public evaluate(player: Player, position: Vector3D): number {
    if (!this.field.containsPoint(position)) {
      return 0;
    }

    const ahead = this.aheadOfBallScore(player, position);
    const congestion = this.congestionScore(player, position);
    const marking = this.markingScore(player, position);

    // TODO: make these weights constants
    return (congestion * -0.1) + (marking * 0.2) + (ahead * 0.2);
  }

  private aheadOfBallScore(player: Player, position: Vector3D): number {
    const post = player.getGoalPost();
    const distance = distanceAheadOfBall(position, this.ball, post);
    const cappedDistance = Math.min(0, distance);
    return scale(cappedDistance, -this.field.xlength, 0, 0, 1);
  }

  private congestionScore(player: Player, position: Vector3D): number {
    const players = player.teamMates();
    return this.congestionCalculator.evaluate(position, players);
  }

  private markingScore(player: Player, position: Vector3D): number {
    const closestThreat = this.getNearestUnhandledThreat(player);
    if (!closestThreat) { return 0; }

    return this.threatHandlingScore(closestThreat, position);
  }

  private getNearestUnhandledThreat(player: Player): Player | null {
    const opponents = player.getOpposingPlayers();
    const team = player.getTeam().getPlayers();
    const threats = opponents.filter((opponent) => {
      return this.isUnhandledThreat(opponent, team);
    });

    return minimumBy(threats, (threat) => {
      return threat.getPosition().distanceTo(player.getPosition());
    });
  }

  private isUnhandledThreat(opponent: Player, team: Player[]): boolean {
    const opponentPosition = opponent.getPosition();
    const post = opponent.getOpposingGoalPost();
    const distance = distanceAheadOfBall(opponentPosition, this.ball, post);
    const isAheadOfBall = distance >= 0;
    return isAheadOfBall && !this.opponentNeutralized(opponent, team);
  }

  private opponentNeutralized(opponent: Player, mates: Player[]): boolean {
    return mates.some((player) => {
      const distance = player.getPosition().distanceTo(opponent.getPosition());
      return distance <= this.markingMargin;
    });
  }

  private threatHandlingScore(opponent: Player, position: Vector3D): number {
    const distance = position.distanceTo(opponent.getPosition());
    if (distance < this.markingMargin) { return 1; }

    return scale(
      distance, this.markingMargin, this.field.diagonalLength(), 1, 0);
  }
}
