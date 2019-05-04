import { COMMAND_ID } from "../constants";
import { ICommand } from "../interfaces/icommand";
import { ICommandFactory } from "../interfaces/icommand_factory";

export class CommandFactory implements ICommandFactory {
  // TODO: Remove this class and pass the mapping directly to its clients
  // or return an error in `getCommand` or a `NullCommand` object
  private commandIdToCommandMapping: Map<COMMAND_ID, ICommand>;

  constructor(commandIdToCommandMapping: Map<COMMAND_ID, ICommand>) {
    this.commandIdToCommandMapping = commandIdToCommandMapping;
  }

  public getCommand(commandName: COMMAND_ID): ICommand {
    return this.commandIdToCommandMapping.get(commandName);
  }
}
