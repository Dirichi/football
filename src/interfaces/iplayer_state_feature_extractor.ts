import { Player } from "../game_objects/player";

export interface IPlayerStateFeatureExtractor {
  teamInControl(player: Player): boolean;
  hasBall(player: Player): boolean;
  hasGoodPassingOptions(player: Player): boolean;
  isInGoodShootingPosition(player: Player): boolean;
  isNearestTeamMateToBall(player: Player): boolean;
}
