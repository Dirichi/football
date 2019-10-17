import { EventQueue } from "../../src/event_queue";
import { IGameClient } from "../../src/interfaces/igame_client";
import { ICommandRequest } from "../../src/interfaces/icommand_request";
import { IParticipationAttributes } from "../../src/interfaces/iparticipation_attributes";
import { IO_MESSAGE_TYPE, PLAYER_ROLE_TYPE } from "../../src/constants";

export class TestGameClient implements IGameClient {
  private id: string;
  private queue: EventQueue;
  private roleType: PLAYER_ROLE_TYPE;

  constructor(
    id: string,
    queue: EventQueue = new EventQueue(),
    roleType: PLAYER_ROLE_TYPE = PLAYER_ROLE_TYPE.KEEPER) {
      this.id = id;
      this.queue = queue;
      this.roleType = roleType;
  }

  public updateGameState(payload: object) {
    this.queue.trigger(IO_MESSAGE_TYPE.GAME_STATE, payload);
  }

  public onCommandRequest(callback: (payload: ICommandRequest) => void): void {
    this.queue.when(IO_MESSAGE_TYPE.COMMAND, callback);
  }

  public assignControllerId(playerId: string): void {
    this.queue.trigger(IO_MESSAGE_TYPE.CLIENT_ASSIGNED_PLAYER, {playerId});
  }

  public simulateCommandRequest(request: {commandId: string}): void {
    const command = {...request, clientId: this.id}
    this.queue.trigger(IO_MESSAGE_TYPE.COMMAND, command);
  }

  public getId(): string {
    return this.id;
  }

  public getPreferredRoleType(): PLAYER_ROLE_TYPE {
    return this.roleType;
  }

  public getParticipation(): IParticipationAttributes {
    return {} as IParticipationAttributes;
  }
}
