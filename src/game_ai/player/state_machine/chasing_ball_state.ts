import { COMMANDS } from "../../../constants";
import { Player } from "../../../game_objects/player";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { IPlayerState } from "../../../interfaces/iplayer_state";

export class ChasingBallState implements IPlayerState {
  private commandFactory: ICommandFactory;

  constructor(commandFactory: ICommandFactory) {
    this.commandFactory = commandFactory;
  }

  public eligibleFor(player: Player): boolean {
    return player.isNearestTeamMateToBall() && !player.teamHasBall();
  }

  public update(player: Player): void {
    if (!this.eligibleFor(player)) {
      return;
    }

    this.commandFactory.getCommand(COMMANDS.CHASE_BALL).execute(player);
  }
}
