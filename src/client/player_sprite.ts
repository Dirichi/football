import { TEAM_ID } from "../constants";
import { IPlayerSchema } from "../interfaces/iplayer_schema";
import { PlayerAnimationController } from "./animation_states/player_animation_controller";

export class PlayerSprite {
  private locallyControlled: boolean = false;

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
    return velocityVectors.some((vector) => Math.abs(vector) > 0);
  }

  public isKicking(): boolean {
    return this.attributes.kicking;
  }

  public getTeamId(): TEAM_ID {
    return this.attributes.teamId;
  }

  public getX(): number {
    return this.attributes.x;
  }

  public getCursor(): { x: number, y: number, w: number, h: number } {
    return {
      h: this.attributes.diameter / 2,
      w: this.attributes.diameter / 2,
      x: this.attributes.x,
      y: this.attributes.y - (this.attributes.diameter * 1.5),
    };
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

  public getVx(): number {
    return this.attributes.vx;
  }

  public getVy(): number {
    return this.attributes.vy;
  }

  public isLocallyControled(): boolean {
    return this.locallyControlled;
  }

  public setLocallyControlled(controlled: boolean): this {
    this.locallyControlled = controlled;
    return this;
  }

  public getId(): string {
    return this.attributes.id;
  }
}
