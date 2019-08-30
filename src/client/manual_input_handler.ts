import { COMMAND_ID, COMMAND_ID_TO_KEY_COMBINATION, INPUT_KEY } from "../constants";
import { ICommandRequest } from "../interfaces/icommand_request";
import { IWebSocket } from "../interfaces/iweb_socket";

export class ManualInputHandler {
  private allowedInputKeysSet: Set<INPUT_KEY>;
  private inputKeysSet: Set<INPUT_KEY>;
  private settings: Map<COMMAND_ID, INPUT_KEY[]>;
  private socket: IWebSocket;

  constructor(socket: IWebSocket, settings?: Map<COMMAND_ID, INPUT_KEY[]>) {
    this.inputKeysSet = new Set([]);
    this.socket = socket;
    this.settings = settings || COMMAND_ID_TO_KEY_COMBINATION;
    const allowedKeysList = [...this.settings.values()].flat();
    this.allowedInputKeysSet = new Set(allowedKeysList);
  }

  public sendInput(): void {
    const commandIds = [...this.settings.keys()];
    const matchedCommandId = commandIds.find((commandId) => {
      return this.commandIsActivated(commandId);
    });

    if (matchedCommandId) {
      this.sendCommand(matchedCommandId);
    }
  }

  public getInputKeys(): INPUT_KEY[] {
    return [...this.inputKeysSet];
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (!this.catchRecognizedCommand(event)) { return; }
    const key = event.code as INPUT_KEY;
    this.inputKeysSet.add(key);
  }

  public handleKeyUp(event: KeyboardEvent): void {
    if (!this.catchRecognizedCommand(event)) { return; }

    const key = event.code as INPUT_KEY;
    this.inputKeysSet.delete(key);
  }

  private commandIsActivated(commandId: COMMAND_ID): boolean {
    const commandKeyCombination = this.settings.get(commandId);
    return commandKeyCombination.every((key) => this.inputKeysSet.has(key));
  }

  private catchRecognizedCommand(event: KeyboardEvent): boolean {
    const key = event.code as INPUT_KEY;
    if (!this.allowedInputKeysSet.has(key)) { return false; }

    event.preventDefault();
    return true;
  }

  private sendCommand(commandId: COMMAND_ID) {
    const commandRequest = { commandId } as ICommandRequest;
    this.socket.emit("command", commandRequest);
  }
}
