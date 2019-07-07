import { Player } from "../../../../../src/game_objects/player";
import { ThreeDimensionalVector } from "../../../../../src/three_dimensional_vector";

export class CongestionCalculator {
  private players: Player[];
  private radiusOfInterest: number;

  constructor(players: Player[], radiusOfInterest: number) {
    this.players = players;
    this.radiusOfInterest = radiusOfInterest;
  }

  public evaluate(position: ThreeDimensionalVector): number {
    return this.players.filter((player) => {
      return player.getPosition().distanceTo(position) <= this.radiusOfInterest;
    }).length;
  }
}
