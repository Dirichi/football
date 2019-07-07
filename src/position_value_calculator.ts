import { CongestionCalculator } from "./game_ai/player/state_machine/calculators/congestion_calculator";
import { IPositionValueCalculator } from "./interfaces/iposition_value_calculator";
import { Player } from "./game_objects/player";
import { ThreeDimensionalVector } from "./three_dimensional_vector";
import { round } from "./utils/helper_functions";

export class PositionValueCalculator implements IPositionValueCalculator {
  private congestionCalculator: CongestionCalculator;

  constructor(congestionCalculator: CongestionCalculator) {
    this.congestionCalculator = congestionCalculator;
  }

  public evaluate(player: Player, position: ThreeDimensionalVector): number {
    return this.congestionScore(player, position);
  }

  private congestionScore(
    player: Player, position: ThreeDimensionalVector): number {
      const congestion = this.congestionCalculator.evaluate(position);
      const congestionInverse = 1 / congestion;
      const score = congestionInverse >= 0.2 ? congestionInverse : 0;
      return round(score, 2);
  }
}
