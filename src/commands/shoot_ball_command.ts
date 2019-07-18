import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { Vector3D } from "../three_dimensional_vector";

export class ShootBallCommand implements ICommand {
  public execute(player: Player, target: Vector3D): void {
    player.kickBall(target);
  }
}
