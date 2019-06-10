import { PLAYER_ROLE_TYPE } from "../constants";
import { ICommandRequest } from "../interfaces/icommand_request";

export interface IGameClient {
  getId(): string;
  updateGameState(payload: object): void;
  onCommandRequest(callback: (request: ICommandRequest) => void): void;
  getPreferredRoleType(): PLAYER_ROLE_TYPE;
}
