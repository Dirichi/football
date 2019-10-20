import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";
import { ShotTrackerService } from "../stats/shot_tracker_service";
import { Vector3D } from "../three_dimensional_vector";

export class ShootBallCommand implements ICommand {
  private shotTracker: ShotTrackerService;

  public setShotTracker(shotTracker: ShotTrackerService): this {
    this.shotTracker = shotTracker;
    return this;
  }

  public execute(player: Player, target: Vector3D): void {
    if (player.kickBall(target)) {
      this.shotTracker.track({
        shooter: player,
        target,
      });
    }
  }
}
