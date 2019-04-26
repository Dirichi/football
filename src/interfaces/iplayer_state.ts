import { Player } from "../game_objects/player";
import { IPlayerStateFeature } from "./iplayer_state_feature";

export interface IPlayerState {
  eligibleFor(features: IPlayerStateFeature): boolean;
  update(player: Player, features: IPlayerStateFeature): void;
}
