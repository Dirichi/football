import { Ball } from "../game_objects/ball";
import { IPlayerBallInteractionMediator } from "../interfaces/iplayer_ball_interaction_mediator";
import { IBallPossessionService } from "../interfaces/iball_possession_service";
import { ITickService } from "../interfaces/itick_service";
import { Player } from "../game_objects/player";
import { ThreeDimensionalVector } from "../three_dimensional_vector";

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
      return player ===
        this.possessionService.getCurrentPlayerInPossessionOrNull();
    }

    public kickBall(
      player: Player, destination: ThreeDimensionalVector): boolean {
        if (!this.canKickBall(player)) { return false; }

        this.temporarilyDisableKicking(player);
        this.ball.moveTowards(destination);
        return true;
    }

    public controlBall(player: Player): boolean {
      if (!this.canKickBall(player)) { return false; }

      this.ball.stop();
      this.ball.reposition(player.feetPosition());
      return true;
    }

    private temporarilyDisableKicking(player: Player): void {
      this.kickBlackList.add(player);
      this.tickService.after(this.kickDisabledTimeout, () => {
        this.kickBlackList.delete(player);
      });
    }

    private isAllowedToKick(player: Player): boolean {
      return !this.kickBlackList.has(player);
    }

    private canKickBall(player: Player): boolean {
      return this.hasBall(player) && this.isAllowedToKick(player);
    }
  }