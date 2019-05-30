import { COMMAND_ID } from "../constants";

export interface ICommandRequest {
  clientId: string;
  commandId: COMMAND_ID;
}
