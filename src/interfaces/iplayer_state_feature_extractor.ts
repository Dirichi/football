import { Player } from "../game_objects/player";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export interface IPlayerStateFeatureExtractor {
  bestPassingOption(player: Player): Player;
  bestPositionOption(player: Player): ThreeDimensionalVector;
  hasBall(player: Player): boolean;
  isNearestTeamMateToBall(player: Player): boolean;
  shotValue(player: Player): number;
  teamInControl(player: Player): boolean;
}
