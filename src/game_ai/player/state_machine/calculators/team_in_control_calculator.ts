import { Team } from "../../../../game_objects/team";
import { ITeamInControlCalculator } from "../../../../interfaces/iteam_in_control_calculator";
import { BallPossessionService } from "../../../../services/ball_possession_service";

export class TeamInControlCalculator implements ITeamInControlCalculator {
  private teamInControl: Team | null;

  constructor(
    private possessionService: BallPossessionService,
    private controlTimeout: number,
    private controlTimer: number = 0) {}

  public update() {
    const currentPlayerInPossession =
      this.possessionService.getCurrentPlayerInPossessionOrNull();
    if (currentPlayerInPossession === null) {
      this.controlTimer += 1;
      this.teamInControl =
        this.controlTimedOut() ? null : this.lastTeamInPossession();
      return;
    }
    this.controlTimer = 0;
    this.teamInControl = currentPlayerInPossession.getTeam();
  }

  public getTeamInControl(): Team | null {
    return this.teamInControl;
  }

  private controlTimedOut(): boolean {
    return this.controlTimer >= this.controlTimeout;
  }

  private lastTeamInPossession(): Team | null {
    const lastPlayerInPossession =
      this.possessionService.getLastPlayerInPossession();
    return lastPlayerInPossession ? lastPlayerInPossession.getTeam() : null;
  }
}
