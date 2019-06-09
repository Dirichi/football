import { ICommandRequest } from "../interfaces/icommand_request";
import { PLAYER_ROLE_TYPE } from "../constants";

export interface IGameClient {
  getId(): string;
  updateGameState(payload: object): void;
  onCommandRequest(callback: (request: ICommandRequest) => void): void;
  getRole(): PLAYER_ROLE_TYPE;
}
