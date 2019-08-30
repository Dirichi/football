import { TEAM_ID } from "../constants";
import { IPlayerSchema } from "../interfaces/iplayer_schema";
import { PlayerAnimationController } from "./animation_states/player_animation_controller";

export class PlayerSprite {
  constructor(
    private attributes: IPlayerSchema,
    private animationController: PlayerAnimationController) {}

  public animate(): void {
    this.animationController.animate(this);
  }

  public update(attributes: IPlayerSchema): void {
    this.attributes = attributes;
  }

  public isMoving(): boolean {
    const velocityVectors = [this.attributes.vx, this.attributes.vy];
    return velocityVectors.some((vector) => vector > 0);
  }

  public getTeamId(): TEAM_ID {
    return this.attributes.teamId;
  }

  public getX(): number {
    return this.attributes.x;
  }

  public getY(): number {
    return this.attributes.y;
  }

  public getWidth(): number {
    return this.attributes.diameter;
  }

  public getHeight(): number {
    return this.attributes.diameter;
  }
}
