import { PLAYER_MESSAGES } from "../constants";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { ICommand } from "../interfaces/icommand";

export class CallForBallCommand implements ICommand {
  constructor(private possessionService: IBallPossessionService) {}

  public execute(player: Player): void {
    const playerInPossession =
      this.possessionService.getCurrentPlayerInPossessionOrNull();
    const isTeamMate =
      playerInPossession && playerInPossession.getTeam() === player.getTeam();
    if (!isTeamMate) { return; }

    player.sendMessage(playerInPossession, PLAYER_MESSAGES.PASS);
  }
}
