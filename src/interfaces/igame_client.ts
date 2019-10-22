import { ICommandRequest } from "../interfaces/icommand_request";
import { IParticipationAttributes } from "./iparticipation_attributes";
import { IPlayerReport } from "./iplayer_report";

export interface IGameClient {
  getId(): string;
  updateGameState(payload: object): void;
  onCommandRequest(callback: (request: ICommandRequest) => void): void;
  getParticipation(): IParticipationAttributes;
  assignControllerId(id: string): void;
  getControllerId(): string;
  saveParticipationReport(
    report: IPlayerReport): Promise<IParticipationAttributes>;
  exit(): void;
}
