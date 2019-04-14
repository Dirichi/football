import { COMMANDS, KEY_DOWN_EVENT_TO_COMMAND_MAP } from "./constants";
import { IWebSocket } from "./iweb_socket";

export class ManualInputHandler {
  private socket: IWebSocket;
  private settings: Map<string, string>;

  constructor(
    socket: IWebSocket,
    settings?: Map<string, string>) {
    this.socket = socket;
    this.settings = settings || KEY_DOWN_EVENT_TO_COMMAND_MAP;
  }

  public handleInput(event: KeyboardEvent) {
    const command = this.settings.get(event.code);
    if (command) {
      this.sendCommand(command);
      event.preventDefault();
    }
  }

  public sendStop() {
    this.sendCommand(COMMANDS.STOP);
  }

  private sendCommand(command: string) {
    this.socket.emit("command", command);
  }
}
