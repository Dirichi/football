import { ICommandRequest } from "../interfaces/icommand_request";
import { IParticipationAttributes } from "./iparticipation_attributes";

export interface IGameClient {
  getId(): string;
  updateGameState(payload: object): void;
  onCommandRequest(callback: (request: ICommandRequest) => void): void;
  getParticipation(): IParticipationAttributes;
  assignControllerId(id: string): void;
}
