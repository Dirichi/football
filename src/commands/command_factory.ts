import { ICommand } from "../interfaces/icommand";
import { ICommandFactory } from "../interfaces/icommand_factory";

export class CommandFactory implements ICommandFactory {
  // TODO: Remove this class and pass the mapping directly to its clients
  // or return an error in `getCommand` or a `NullCommand` object
  private nameToCommandMapping: Map<string, ICommand>;

  constructor(nameToCommandMapping: Map<string, ICommand>) {
    this.nameToCommandMapping = nameToCommandMapping;
  }

  public getCommand(commandName: string): ICommand {
    return this.nameToCommandMapping.get(commandName);
  }
}
