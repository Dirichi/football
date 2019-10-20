import { EventQueue } from "../event_queue";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { IShot } from "../interfaces/ishot";
import { GoalDetectionService } from "../services/goal_detection_service";

export class ShotTrackerService {
  private enabled: boolean = false;
  private currentlyTrackedShot?: IShot = null;

  constructor(
    private queue: EventQueue,
    private ballPossessionService: IBallPossessionService,
    private goalDetectionService: GoalDetectionService) { }

    public setup(): void {
      if (this.enabled) { return; }

      this.listenForGoals();
      this.listenForPossessionChange();
      this.enabled = true;
    }

  public track(shot: IShot): void {
    this.checkEnabled();
    this.checkCurrentlyTrackedShot();
    this.currentlyTrackedShot = shot;
  }

  public whenTakesShot(player: Player, callback: (shot: IShot) => void): void {
    this.queue.when(this.playerEventTag(player), callback);
  }

  private listenForPossessionChange(): void {
    this.ballPossessionService.whenPossessionChanged((player) => {
      if (!this.currentlyTrackedShot) { return; }

      this.reportShotInterceptedBy(player);
    });
  }

  private listenForGoals(): void {
    this.goalDetectionService.whenGoalDetected((unused) => {
      if (!this.currentlyTrackedShot) { return; }

      this.reportShotSuccessful();
    });
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

  private checkCurrentlyTrackedShot(): void {
    if (this.currentlyTrackedShot) {
      throw new Error("Already tracking another shot");
    }
  }

  private checkEnabled(): void {
    if (!this.enabled) {
      throw new Error("ShotTrackerService not yet enabled.");
    }
  }
}
