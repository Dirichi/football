import { Player } from "../game_objects/player";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export interface IPlayerStateFeature {
  bestPassingOption: Player;
  bestPositionOption: ThreeDimensionalVector;
  hasBall: boolean;
  hasOpenPassingOptions: boolean;
  hasWaitMessages: boolean;
  isNearestTeamMateToBall: boolean;
  shotValue: number;
  teamInControl: boolean;
}
