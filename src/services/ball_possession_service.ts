import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { IEventQueue } from "../interfaces/ievent_queue";
import { minimumBy } from "../utils/helper_functions";

export class BallPossessionService implements IBallPossessionService {
  private ball: Ball;
  private currentPlayerInPossession?: Player;
  private lastPlayerInPossession?: Player;
  private players: Player[];
  private queue: IEventQueue;

  constructor(ball: Ball, players: Player[], queue: IEventQueue) {
    this.ball = ball;
    this.players = players;
    this.queue = queue;
    this.currentPlayerInPossession = null;
    this.lastPlayerInPossession = null;
  }

  public update(): void {
    this.currentPlayerInPossession = this.findCurrentPlayerInPossession();
    if (this.currentPlayerInPossession) {
      this.publishPossessionChangedEvents();
      this.lastPlayerInPossession = this.currentPlayerInPossession;
    }
  }

  public hasBall(player: Player): boolean {
    return this.currentPlayerInPossession === player;
  }

  public getLastPlayerInPossession(): Player | null {
    // TODO: Better naming for this method
    return this.lastPlayerInPossession;
  }

  public getCurrentPlayerInPossessionOrNull(): Player | null {
    return this.currentPlayerInPossession;
  }

  public whenPossessionChanged(callback: (player: Player) => void): void {
    this.queue.when(`${this.eventTag("possessionChanged")}`, callback);
  }

  private findCurrentPlayerInPossession(): Player | null {
    const playersInPossession =
      this.players.filter((player) => this.closeToBall(player));

    return minimumBy(playersInPossession, (player) => {
      return player.getPosition().distanceTo(this.ball.getPosition());
    });
  }

  private eventTag(event: string): string {
    return `${this.constructor.name}.${event}`;
  }

  private closeToBall(player: Player): boolean {
    const distanceToBall =
      player.getPosition().distanceTo(this.ball.getPosition());
    return distanceToBall < ((player.diameter / 2 + this.ball.diameter / 2));
  }

  private publishPossessionChangedEvents(): void {
    if (!this.lastPlayerInPossession) { return; }

    if (this.lastPlayerInPossession !== this.currentPlayerInPossession) {
      this.queue.trigger(
        `${this.eventTag("possessionChanged")}`,
        this.currentPlayerInPossession);
    }
  }
}
