import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IPlayerStateFeatureExtractor {
  bestDefencePositionOption(player: Player): Vector3D;
  bestDribbleOption(player: Player): Vector3D;
  bestDribbleValue(player: Player): number;
  bestPassingOption(player: Player): Player;
  bestPassValue(player: Player): number;
  bestPositionOption(player: Player): Vector3D;
  bestShotValue(player: Player): number;
  bestShotTargetOption(player: Player): Vector3D;
  hasBall(player: Player): boolean;
  isEligibleToMark(player: Player): boolean;
  receivedWaitMessage(player: Player): boolean;
  teamInControl(player: Player): boolean;
  expectedPassInterceptedOrCompleted(player: Player): boolean;
  isNearestToBall(player: Player): boolean;
}
