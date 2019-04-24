import { COMMANDS } from "../../../constants";
import { Ball } from "../../../game_objects/ball";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";

export class DefensiveRunState implements IPlayerState {
  private commandFactory: ICommandFactory;
  private ball: Ball;

  constructor(commandFactory: ICommandFactory, ball: Ball) {
    this.commandFactory = commandFactory;
    this.ball = ball;
  }

  public eligibleFor(player: Player): boolean {
    return !player.teamInControl() && !player.isNearestTeamMateToBall(this.ball);
  }

  public update(player: Player): void {
    if (this.eligibleFor(player)) {
      this.commandFactory
        .getCommand(COMMANDS.MOVE_TO_DEFENSIVE_POSITION)
        .execute(player);
    }
  }
}
