import { EventQueue } from "../event_queue";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { IPass } from "../interfaces/ipass";
import { Logger } from "../utils/logger";

export class PassTrackerService {
  private currentlyTrackedPass?: IPass = null;

  constructor(
    private eventQueue: EventQueue,
    private ballPossessionService: IBallPossessionService) { }

  public setup(): void {
    this.ballPossessionService.oncePossessionChanged((playerInPossession) => {
      if (!this.currentlyTrackedPass) return;
      this.recordPassCompletion(playerInPossession);
    });
  }

  public track(pass: IPass): void {
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
      throw new Error(
        `Already tracking another pass: \
        ${JSON.stringify(this.currentlyTrackedPass)})`);
    }
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
