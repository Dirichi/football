import { ICommand } from "./icommand";

export interface ICommandFactory {
  getCommand(commandName: string): ICommand;
}
