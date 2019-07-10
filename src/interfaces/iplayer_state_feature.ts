import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IPlayerStateFeature {
  bestPassingOption: Player;
  bestPositionOption: Vector3D;
  hasBall: boolean;
  hasWaitMessages: boolean;
  isNearestTeamMateToBall: boolean;
  shotValue: number;
  teamInControl: boolean;
}
