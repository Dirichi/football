import { Player } from "../game_objects/player";

export interface IPlayerStateFeature {
  bestPassingOption: Player;
  hasBall: boolean;
  hasOpenPassingOptions: boolean;
  hasWaitMessages: boolean;
  isNearestTeamMateToBall: boolean;
  shotValue: number;
  teamInControl: boolean;
}
