import { COMMANDS } from "../../../constants";
import { IPlayerState } from "../../../interfaces/iplayer_state";
import { ICommandFactory } from "../../../interfaces/icommand_factory";
import { Player } from "../../../game_objects/player";

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
