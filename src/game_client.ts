import { Socket } from "socket.io";
import { COMMAND_ID, IO_MESSAGE_TYPE, PLAYER_ROLE_TYPE } from "./constants";
import { ICommandRequest } from "./interfaces/icommand_request";
import { IGameClient } from "./interfaces/igame_client";

export class GameClient implements IGameClient {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public getId(): string {
    return this.socket.id;
  }

  public updateGameState(payload: object): void {
    this.socket.emit(IO_MESSAGE_TYPE.GAME_STATE, payload);
  }

  public onCommandRequest(callback: (payload: ICommandRequest) => void): void {
    this.socket.on(
      IO_MESSAGE_TYPE.COMMAND, (payload: {commandId: COMMAND_ID}) => {
        const request =
          {...payload, clientId: this.socket.id } as ICommandRequest;
        callback.call(this, request);
    });
  }

  public getRole(): PLAYER_ROLE_TYPE {
    return PLAYER_ROLE_TYPE.KEEPER;
  }
}
