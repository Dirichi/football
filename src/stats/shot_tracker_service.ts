import { EventQueue } from "../event_queue";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { IShot } from "../interfaces/ishot";
import { GoalDetectionService } from "../services/goal_detection_service";

export class ShotTrackerService {

  private currentlyTrackedShot?: IShot = null;

  constructor(
    private queue: EventQueue,
    private ballPossessionService: IBallPossessionService,
    private goalDetectionService: GoalDetectionService) { }

    public enable(): void {
      this.goalDetectionService.onceGoalDetected((unused) => {
        if (!this.currentlyTrackedShot) { return; }

        this.reportShotSuccessful();
      });
      this.ballPossessionService.oncePossessionChanged((player) => {
        if (!this.currentlyTrackedShot) { return; }

        this.reportShotInterceptedBy(player);
      });
    }

  public track(shot: IShot): void {
    this.checkCurrentlyTrackedShot();
    this.currentlyTrackedShot = shot;
  }

  public whenTakesShot(player: Player, callback: (shot: IShot) => void): void {
    this.queue.when(this.playerEventTag(player), callback);
  }

  private playerEventTag(player: Player): string {
    return `${this.constructor.name}.${player.getGameObjectId()}.shot`;
  }

  private reportShotSuccessful(): void {
    const shot = this.currentlyTrackedShot;
    shot.isGoal = true;
    this.queue.trigger(this.playerEventTag(shot.shooter), shot);
    this.currentlyTrackedShot = null;
  }

  private reportShotInterceptedBy(player: Player): void {
    const shot = this.currentlyTrackedShot;
    shot.isGoal = false;
    shot.interceptedBy = player;
    this.queue.trigger(this.playerEventTag(shot.shooter), shot);
    this.currentlyTrackedShot = null;
  }

  private checkCurrentlyTrackedShot() {
    if (this.currentlyTrackedShot) {
      throw new Error(
        `Already tracking another shot: ${this.currentlyTrackedShot}`);
    }
  }
}
