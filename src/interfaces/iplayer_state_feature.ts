import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IPlayerStateFeature {
  bestDribblingOption: Vector3D;
  bestDribbleValue: number;
  bestPassingOption: Player;
  bestPassValue: number;
  bestPositionOption: Vector3D;
  hasBall: boolean;
  hasWaitMessages: boolean;
  isNearestTeamMateToBall: boolean;
  shotValue: number;
  shouldDribble: boolean;
  teamInControl: boolean;
}
