import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { ICollisionPayload } from "../interfaces/icollision_payload";
import { IEventQueue } from "../interfaces/ievent_queue";

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
    // Clear data about the current player in possession.
    // It will be refreshed when another ball collision event
    // occurs
    this.currentPlayerInPossession = null;
  }

  public enable() {
    this.listenForBallCollisions();
  }

  public getLastPlayerInPossession(): Player | null {
    // TODO: Better naming for this method
    return this.lastPlayerInPossession;
  }

  public getCurrentPlayerInPossessionOrNull(): Player | null {
    return this.currentPlayerInPossession;
  }

  private listenForBallCollisions() {
    this.queue.when(`${this.ball.getGameObjectId()}.collision`,
      (data: ICollisionPayload) => {
        this.updateBallPossessionData(data);
      });
  }

  private updateBallPossessionData(payload: ICollisionPayload) {
    const playerInPossession = this.players.find((player) => {
      return player.getGameObjectId() === payload.colliderId;
    });

    if (playerInPossession) {
      this.currentPlayerInPossession = playerInPossession;
      this.lastPlayerInPossession = playerInPossession;
    }
  }
}
