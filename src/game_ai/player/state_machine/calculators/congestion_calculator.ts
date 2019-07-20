import { Player } from "../../../../../src/game_objects/player";
import { Vector3D } from "../../../../../src/three_dimensional_vector";
import { scale } from "../../../../utils/helper_functions";

export class CongestionCalculator {
  constructor(private radiusOfInterest: number) {}

  public evaluate(position: Vector3D, players: Player[]): number {
    return players.reduce((totalCongestion, player) => {
      totalCongestion += this.individualContributionToCongestion(
        player, position);
      return totalCongestion;
    }, 0);
  }

  private individualContributionToCongestion(
    player: Player, position: Vector3D): number {
      const distance = player.getPosition().distanceTo(position);
      if (distance >= this.radiusOfInterest) { return 0; }
      return scale(distance, 0, this.radiusOfInterest, 1, 0);
    }
}
