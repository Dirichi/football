import { EventQueue } from "../event_queue";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { IPass } from "../interfaces/ipass";

export class PassTrackerService {
  private enabled: boolean = false;
  private currentlyTrackedPass?: IPass = null;

  constructor(
    private eventQueue: EventQueue,
    private ballPossessionService: IBallPossessionService) { }

  public setup(): void {
    if (this.enabled) { return; }
    this.listenForPossessionChange();
    this.enabled = true;
  }

  public track(pass: IPass): void {
    this.checkEnabled();
    this.checkCurrentlyTrackedPass();
    this.currentlyTrackedPass = pass;
  }

  public whenMakesPass(player: Player, callback: (pass: IPass) => void): void {
    this.eventQueue.when(this.playerEventTag(player), callback);
  }

  private playerEventTag(player: Player): string {
    return `${this.constructor.name}.${player.getGameObjectId()}.passed`;
  }

  private checkCurrentlyTrackedPass(): void {
    if (this.currentlyTrackedPass) {
      throw new Error("Already tracking another pass");
    }
  }

  private checkEnabled(): void {
    if (!this.enabled) {
      throw new Error("PassTrackerService not yet enabled.");
    }
  }

  private listenForPossessionChange(): void {
    this.ballPossessionService.whenPossessionChanged((playerInPossession) => {
      if (!this.currentlyTrackedPass) { return; }
      this.recordPassCompletion(playerInPossession);
    });
  }

  private recordPassCompletion(playerInPossession: Player) {
    const pass = this.currentlyTrackedPass;
    const receiverIsTeammate =
      pass.sender.getTeam() === playerInPossession.getTeam();
    pass.eventualReceiver = playerInPossession;
    pass.isSuccessful = receiverIsTeammate;
    this.eventQueue.trigger(this.playerEventTag(pass.sender), {...pass});
    this.currentlyTrackedPass = null;
  }
}
