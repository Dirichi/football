import { ICommandRequest } from "./icommand_request";

export interface ICommandRequestHandler {
  handle(command: ICommandRequest): void;
}
