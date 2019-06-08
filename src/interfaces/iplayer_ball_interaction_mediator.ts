import { Player } from "../game_objects/player";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

export interface IPlayerBallInteractionMediator {
  hasBall(player: Player): boolean;
  kickBall(player: Player, destination: ThreeDimensionalVector): boolean;
  controlBall(player: Player): boolean;
}
