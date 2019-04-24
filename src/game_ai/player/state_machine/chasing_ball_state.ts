import { Ball } from "../../../game_objects/ball";
import { COMMANDS } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";

export class ChasingBallState implements IPlayerState {
  private commandFactory: ICommandFactory;
  private ball: Ball;

  constructor(commandFactory: ICommandFactory, ball: Ball) {
    this.commandFactory = commandFactory;
  }

  public eligibleFor(player: Player): boolean {
    return player.isNearestTeamMateToBall(this.ball) && !player.teamInControl();
  }

  public update(player: Player): void {
    if (this.eligibleFor(player)) {
      this.commandFactory.getCommand(COMMANDS.CHASE_BALL).execute(player);
    }
  }
}
