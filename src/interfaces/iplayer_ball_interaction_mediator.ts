import { Player } from "../game_objects/player";
import { Vector3D } from "../three_dimensional_vector";

export interface IPlayerBallInteractionMediator {
  hasBall(player: Player): boolean;
  kickBall(
    player: Player, destination: Vector3D, callback?: () => void): boolean;
  controlBall(player: Player): boolean;
  chaseBall(player: Player): void;
}
