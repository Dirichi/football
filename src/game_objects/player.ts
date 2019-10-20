import v4 from "uuid/v4";
import { PLAYER_MESSAGES, PLAYER_ROLE_TYPE, Y_BALL_MARGIN_FOR_KICKOFF_SUPPORT } from "../constants";
import { EventQueue } from "../event_queue";
import { ICircle } from "../interfaces/icircle";
import { ICollidable } from "../interfaces/icollidable";
import { IPlayerBallInteractionMediator } from "../interfaces/iplayer_ball_interaction_mediator";
import { IPlayerController } from "../interfaces/iplayer_controller";
import { IPlayerMessage } from "../interfaces/iplayer_message";
import { IPlayerSchema } from "../interfaces/iplayer_schema";
import { PlayerPhysics } from "../physics/player_physics";
import { Vector3D } from "../three_dimensional_vector";
import { minimumBy } from "../utils/helper_functions";
import { Ball } from "./ball";
import { PlayerRole } from "./player_role";
import { Post } from "./post";
import { Team } from "./team";

export class Player implements ICollidable {
  // TODO: Make these private
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public diameter: number;

  private opposingGoalPost?: Post;
  private physics?: PlayerPhysics;
  private maximumSpeed?: number;
  private id: string;
  private team?: Team;
  private controller?: IPlayerController;
  private messageQueue?: EventQueue;
  private ballInteractionMediator?: IPlayerBallInteractionMediator;
  private role?: PlayerRole;
  private messages: IPlayerMessage[];
  private ballControlEnabled: boolean;
  private kicking: boolean;

  constructor(x: number, y: number, vx: number, vy: number, diameter: number) {
    this.id = v4(); // Randomly generated id
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.diameter = diameter;
    // TODO: Details like this should maybe be hidden away in another object
    // Like a PhysicalRepresentation or something like that. So that we can
    // swap representations out as we see fit.
    this.messages = [];
    this.ballControlEnabled = true;
    this.kicking = false;
  }

  public update(): void {
    this.controlBall();
    this.physics.update(this);
    this.controller.update();
  }

  public moveInDirection(direction: Vector3D): void {
    const velocity = direction.unit().scalarMultiply(this.maximumSpeed);
    this.setVelocity(velocity);
  }

  public stop(): void {
    [this.vx, this.vy] = [0, 0];
  }

  public feetPosition(): Vector3D {
    // TODO: Actually properly calculate feetPosition
    return this.getPosition();
  }

  public moveTowards(target: Vector3D): void {
    const unitDelta = target.minus(this.getPosition()).unit();
    const velocity = unitDelta.scalarMultiply(this.maximumSpeed);
    this.setVelocity(velocity);
  }

  public setPhysics(physics: PlayerPhysics): Player {
    this.physics = physics;
    return this;
  }

  public setMaximumSpeed(speed: number): Player {
    this.maximumSpeed = speed;
    return this;
  }

  public getMaximumSpeed(): number {
    return this.maximumSpeed;
  }

  public getGoalPost(): Post {
    return this.team.getGoalPost();
  }

  public getOpposingGoalPost(): Post {
    return this.opposingGoalPost;
  }

  public getOpposingFieldPlayers(): Player[] {
    return this.getTeam().getOpposition().getFieldPlayers();
  }

  public getOpposingPlayers(): Player[] {
    return this.getTeam().getOpposition().getPlayers();
  }

  public setOpposingGoalPost(post: Post): Player {
    this.opposingGoalPost = post;
    return this;
  }

  public serialized(): IPlayerSchema {
    return {
      diameter: this.diameter,
      id: this.id,
      kicking: this.kicking,
      teamId: this.team.getId(),
      vx: this.vx,
      vy: this.vy,
      x: this.x,
      y: this.y,
    } as IPlayerSchema;
  }

  public getGameObjectId(): string {
    return this.id;
  }

  public getVelocity(): Vector3D {
    return new Vector3D(this.vx, this.vy, 0);
  }

  public getPosition(): Vector3D {
    return new Vector3D(this.x, this.y, 0);
  }

  public getShape(): ICircle {
    return {
      getCentre: () => new Vector3D(this.x, this.y, 0),
      getDiameter: () => this.diameter,
      kind: "circle",
    } as ICircle;
  }

  public getTeam(): Team {
    return this.team;
  }

  public teamMates(): Player[] {
    return this.team.getPlayers().filter((player) => player !== this);
  }

  public getNearestTeamMate(): Player | null {
    const position = this.getPosition();

    return minimumBy(this.teamMates(), (teammate: Player): number => {
      return teammate.getPosition().distanceTo(position);
    });
  }

  public setTeam(team: Team): Player {
    this.team = team;
    return this;
  }

  public setRole(role: PlayerRole): Player {
    this.role = role;
    return this;
  }

  public getRole(): PlayerRole {
    return this.role;
  }

  public setController(controller: IPlayerController): Player {
    this.controller = controller;
    return this;
  }

  public setMessageQueue(queue: EventQueue): Player {
    this.messageQueue = queue;
    this.listenForMessages();
    return this;
  }

  public setBallInteractionMediator(
    mediator: IPlayerBallInteractionMediator): Player {
    this.ballInteractionMediator = mediator;
    return this;
  }

  public moveTowardsAttackingPosition(): void {
    this.moveTowards(this.attackingPosition());
  }

  public moveTowardsDefensivePosition(): void {
    this.moveTowards(this.defendingPosition());
  }

  public sendMessage(player: Player, message: PLAYER_MESSAGES): void {
    this.messageQueue.trigger(
      `player.${player.getGameObjectId()}.messaged`,
      { title: message, sender: this });
  }

  public enableControls(): void {
    this.ballControlEnabled = true;
    this.controller.enable();
  }

  public disableControls(): void {
    this.ballControlEnabled = false;
    this.controller.disable();
  }

  public prepareForKickOff(): void {
    [this.x, this.y] = [this.kickOffPosition().x, this.kickOffPosition().y];
  }

  public prepareToStartKickOff(ball: Ball): void {
    this.x = ball.getPosition().x;
    this.y = ball.getPosition().y;
  }

  public prepareToSupportKickOff(ball: Ball): void {
    this.x = ball.getPosition().x;
    this.y = ball.getPosition().y - Y_BALL_MARGIN_FOR_KICKOFF_SUPPORT;
  }

  public kickBall(destination: Vector3D): boolean {
    this.kicking = this.ballInteractionMediator.kickBall(
      this, destination, () => this.resetKicking());
    return this.kicking;
  }

  public hasBall(): boolean {
    return this.ballInteractionMediator.hasBall(this);
  }

  public controlBall(): boolean {
    if (!this.ballControlEnabled) { return false; }

    return this.ballInteractionMediator.controlBall(this);
  }

  public chaseBall(): void {
    this.ballInteractionMediator.chaseBall(this);
  }

  public trackBall(): void {
    this.ballInteractionMediator.trackBall(this);
  }

  public getMessages(): IPlayerMessage[] {
    return this.messages.map((message) => {
      return { ...message };
    });
  }

  public clearMessagesByTitle(messageTitle: string): void {
    this.messages =
      this.messages.filter((message) => message.title !== messageTitle);
  }

  public isKeeper(): boolean {
    return this.role.getType() === PLAYER_ROLE_TYPE.KEEPER;
  }

  private attackingPosition(): Vector3D {
    return this.role.getDefaultAttackingPosition(this.team.getSide());
  }

  private defendingPosition(): Vector3D {
    return this.role.getDefaultDefendingPosition(this.team.getSide());
  }

  private kickOffPosition(): Vector3D {
    return this.role.getDefaultDefendingPosition(this.team.getSide());
  }

  private listenForMessages(): void {
    this.messageQueue.when(
      `player.${this.id}.messaged`, (message: IPlayerMessage) => {
        this.messages.push(message);
      });
  }

  private setVelocity(velocity: Vector3D): void {
    [this.vx, this.vy] = [velocity.x, velocity.y];
  }

  private resetKicking(): void {
    this.kicking = false;
  }
}
