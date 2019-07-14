import { Player } from "../game_objects/player";
import { IPlayerStateFeatureExtractor } from "./iplayer_state_feature_extractor";

export interface IPlayerState {
  eligibleFor(player: Player): boolean;
  update(player: Player): void;
}
