import { EventQueue } from "../event_queue";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { IPass } from "../interfaces/ipass";

export class PassTrackerService {
  constructor(
    private eventQueue: EventQueue,
    private ballPossessionService: IBallPossessionService) { }

  public registerPass(pass: IPass): void {
    this.ballPossessionService.oncePossessionChanged((playerInPossession) => {
      const receiverIsTeammate =
        pass.sender.getTeam() === playerInPossession.getTeam();
      pass.eventualReceiver = playerInPossession;
      pass.isSuccessful = receiverIsTeammate;
      this.eventQueue.trigger(this.playerEventTag(pass.sender), { ...pass });
    });
  }

  public whenMakesPass(player: Player, callback: (pass: IPass) => void): void {
    this.eventQueue.when(this.playerEventTag(player), callback);
  }

  private playerEventTag(player: Player): string {
    return `${this.constructor.name}.${player.getGameObjectId()}.passed`;
  }
}
