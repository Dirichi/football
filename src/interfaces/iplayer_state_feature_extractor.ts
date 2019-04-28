import { Player } from "../game_objects/player";

export interface IPlayerStateFeatureExtractor {
  bestPassingOption(player: Player): Player;
  hasBall(player: Player): boolean;
  hasOpenPassingOptions(player: Player): boolean;
  isNearestTeamMateToBall(player: Player): boolean;
  shotValue(player: Player): number;
  teamInControl(player: Player): boolean;
}
