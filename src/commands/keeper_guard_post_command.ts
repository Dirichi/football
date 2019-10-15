import { Player } from "../game_objects/player";
import { ICommand } from "../interfaces/icommand";

export class KeeperGuardPostCommand implements ICommand {
  public execute(player: Player): void {
    const post = player.getGoalPost();
    if (post.y > player.y || player.y > (post.y + post.ylength)) {
      // by default this is in front of the goal post.
      player.moveTowardsDefensivePosition();
    } else {
      player.trackBall();
    }
  }
}
