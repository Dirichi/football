import { CongestionCalculator } from "./game_ai/player/state_machine/calculators/congestion_calculator";
import { ShotValueCalculator } from "./game_ai/player/state_machine/calculators/shot_value_calculator";
import { Player } from "./game_objects/player";
import { IPositionValueCalculator } from "./interfaces/iposition_value_calculator";
import { ThreeDimensionalVector } from "./three_dimensional_vector";
import { round } from "./utils/helper_functions";

export class PositionValueCalculator implements IPositionValueCalculator {
  private congestionCalculator: CongestionCalculator;
  private shotValueCalculator: ShotValueCalculator;

  constructor(
    congestionCalculator: CongestionCalculator,
    shotValueCalculator: ShotValueCalculator) {
      this.congestionCalculator = congestionCalculator;
      this.shotValueCalculator = shotValueCalculator;
  }

  public evaluate(player: Player, position: ThreeDimensionalVector): number {
    const congestionScore = this.congestionScore(player, position);
    const shotValueScore = this.shotValueScore(player, position);

    const weightedScore = (congestionScore * 0.5) + (shotValueScore * 0.5);
    return round(weightedScore, 2);
  }

  private congestionScore(
    player: Player, position: ThreeDimensionalVector): number {
      const congestion = this.congestionCalculator.evaluate(position);
      const congestionInverse = 1 / congestion;
      const score = congestionInverse >= 0.2 ? congestionInverse : 0;
      return score;
  }

  private shotValueScore(
    player: Player, position: ThreeDimensionalVector): number {
      return this.shotValueCalculator.evaluate(player, position);
    }
}
