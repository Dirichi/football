import { Player } from "../game_objects/player";
import { IPlayerReport } from "../interfaces/iplayer_report";
import { PassTrackerService } from "./pass_tracker_service";
import { ShotTrackerService } from "./shot_tracker_service";

export class PlayerReportService {
  private reports: Map<string, IPlayerReport> = new Map([]);

  constructor(
    private passTracker: PassTrackerService,
    private shotTracker: ShotTrackerService) {}

  public monitorPlayers(players: Player[]): void {
    players.forEach((player) => {
      this.monitorPlayer(player);
    });
  }

  public monitorPlayer(player: Player): void {
    if (this.reports.get(player.getGameObjectId())) { return; }
    this.initializeReport(player);
    this.trackPasses(player);
    this.trackShots(player);
  }

  public getAllReports(): Map<string, IPlayerReport> {
    return this.reports;
  }

  private initializeReport(player: Player): void {
    this.reports.set(player.getGameObjectId(), {
      completedPasses: 0,
      totalGoals: 0,
      totalPasses: 0,
      totalRepossessions: 0,
      totalShots: 0,
    });
  }

  private trackPasses(player: Player): void {
    this.passTracker.whenMakesPass(player, (pass) => {
      const playerReport = this.reports.get(player.getGameObjectId());
      if (pass.isSuccessful) {
        playerReport.completedPasses += 1;
      }
      playerReport.totalPasses += 1;
    });
  }

  private trackShots(player: Player): void {
    this.shotTracker.whenTakesShot(player, (shot) => {
      const playerReport = this.reports.get(player.getGameObjectId());
      if (shot.isGoal) {
        playerReport.totalGoals += 1;
      }
      playerReport.totalShots += 1;
    });
  }
}
