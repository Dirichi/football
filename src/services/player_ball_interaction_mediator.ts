import { Ball } from "../game_objects/ball";
import { Player } from "../game_objects/player";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { IPlayerBallInteractionMediator } from "../interfaces/iplayer_ball_interaction_mediator";
import { ITickService } from "../interfaces/itick_service";
import { Vector3D } from "../three_dimensional_vector";

export class PlayerBallInteractionMediator
  implements IPlayerBallInteractionMediator {
  private ball: Ball;
  private possessionService: IBallPossessionService;
  private tickService: ITickService;
  private kickBlackList: Set<Player>;
  private kickDisabledTimeout: number;

  constructor(
    ball: Ball,
    possessionService: IBallPossessionService,
    tickService: ITickService,
    kickDisabledTimeout: number) {
    this.ball = ball;
    this.possessionService = possessionService;
    this.tickService = tickService;
    this.kickBlackList = new Set([]);
    this.kickDisabledTimeout = kickDisabledTimeout;
  }

  public hasBall(player: Player): boolean {
    return this.possessionService.hasBall(player);
  }

  public kickBall(
    player: Player, destination: Vector3D, callback?: () => void): boolean {
    if (!this.canKickBall(player)) { return false; }

    this.temporarilyDisableKicking(player, callback);
    this.ball.moveTowards(destination);
    return true;
  }

  public controlBall(player: Player): boolean {
    if (!this.canKickBall(player)) { return false; }

    this.ball.stop();
    this.ball.reposition(player.feetPosition());
    return true;
  }

  public chaseBall(player: Player): void {
    if (this.hasBall(player)) { return player.stop(); }
    player.moveTowards(this.ball.getPosition());
  }

  public trackBall(player: Player): void {
    player.moveTowards(new Vector3D(player.x, this.ball.y, 0));
  }

  private temporarilyDisableKicking(
    player: Player, callback?: () => void): void {
    this.kickBlackList.add(player);
    this.tickService.after(this.kickDisabledTimeout, () => {
      this.kickBlackList.delete(player);
      if (callback) { callback.call(this); }
    });
  }

  private isAllowedToKick(player: Player): boolean {
    return !this.kickBlackList.has(player);
  }

  private canKickBall(player: Player): boolean {
    return this.hasBall(player) && this.isAllowedToKick(player);
  }
}
