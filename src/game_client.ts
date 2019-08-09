import { COMMAND_ID, IO_MESSAGE_TYPE, PLAYER_ROLE_TYPE } from "./constants";
import { ICommandRequest } from "./interfaces/icommand_request";
import { IGameClient } from "./interfaces/igame_client";
import { IWebSocket } from "./interfaces/iweb_socket";
import { User } from "./models/user";

export class GameClient implements IGameClient {
  private user: User;
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

  public getPreferredRoleType(): PLAYER_ROLE_TYPE {
    return this.socket.getParticipation().roleType;
  }

  public joinAssignedRoom(): void {
    const room = this.socket.getGameRoom();
    room.addClient(this);
  }
}
