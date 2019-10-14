import { COMMAND_ID, IO_MESSAGE_TYPE } from "./constants";
import { ICommandRequest } from "./interfaces/icommand_request";
import { IGameClient } from "./interfaces/igame_client";
import { IParticipationAttributes } from "./interfaces/iparticipation_attributes";
import { IWebSocket } from "./interfaces/iweb_socket";

export class GameClient implements IGameClient {
  private socket: IWebSocket;

  constructor(socket: IWebSocket) {
    this.socket = socket;
  }

  public getId(): string {
    return this.socket.getId();
  }

  public updateGameState(payload: object): void {
    this.socket.emit(IO_MESSAGE_TYPE.GAME_STATE, payload);
  }

  public onCommandRequest(callback: (payload: ICommandRequest) => void): void {
    this.socket.on(
      IO_MESSAGE_TYPE.COMMAND, (payload: {commandId: COMMAND_ID}) => {
        const request =
          {...payload, clientId: this.getId() } as ICommandRequest;
        callback.call(this, request);
    });
  }

  public getParticipation(): IParticipationAttributes {
    // PART
    // PARTFIX: Ensure that participation is cached on the client on creation?
    return this.socket.getParticipation();
  }

  public joinAssignedRoom(): void {
    const room = this.socket.getGameRoom();
    room.addClient(this);
  }

  public assignControllerId(playerId: string): void {
    this.socket.emit(IO_MESSAGE_TYPE.CLIENT_ASSIGNED_PLAYER, {playerId});
  }
}
