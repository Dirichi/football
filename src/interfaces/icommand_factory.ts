import { COMMAND_ID } from "../constants";
import { ICommand } from "./icommand";

export interface ICommandFactory {
  getCommand(commandName: COMMAND_ID): ICommand;
}
