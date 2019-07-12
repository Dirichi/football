import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IPlayerStateFeatureExtractor {
  bestPassValue(player: Player): number;
  bestDribbleValue(player: Player): number;
  bestDribblingOption(player: Player): Vector3D;
  bestPassingOption(player: Player): Player;
  bestPositionOption(player: Player): Vector3D;
  hasBall(player: Player): boolean;
  isNearestTeamMateToBall(player: Player): boolean;
  shotValue(player: Player): number;
  shouldDribble(player: Player): boolean;
  teamInControl(player: Player): boolean;
}
