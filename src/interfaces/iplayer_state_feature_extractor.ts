import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IPlayerStateFeatureExtractor {
  bestPassingOption(player: Player): Player;
  bestPositionOption(player: Player): Vector3D;
  hasBall(player: Player): boolean;
  isNearestTeamMateToBall(player: Player): boolean;
  shotValue(player: Player): number;
  teamInControl(player: Player): boolean;
}
