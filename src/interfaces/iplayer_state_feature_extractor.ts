import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IPlayerStateFeatureExtractor {
  bestDribbleOption(player: Player): Vector3D;
  bestDribbleValue(player: Player): number;
  bestPassingOption(player: Player): Player;
  bestPassValue(player: Player): number;
  bestPositionOption(player: Player): Vector3D;
  hasBall(player: Player): boolean;
  isNearestTeamMateToBall(player: Player): boolean;
  receivedWaitMessage(player: Player): boolean;
  shotValue(player: Player): number;
  teamInControl(player: Player): boolean;
  expectedPassInterceptedOrCompleted(player: Player): boolean;
}
