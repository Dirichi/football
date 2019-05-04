import { ICommandRequest } from "./icommand_request";

export interface ICommandHandler {
  handle(command: ICommandRequest): void;
}
