import { IPlayerStateFeature } from "./iplayer_state_feature";
import { Player } from "../game_objects/player";

export interface IPlayerState {
  eligibleFor(features: IPlayerStateFeature): boolean;
  update(player: Player, features: IPlayerStateFeature): void;
}
