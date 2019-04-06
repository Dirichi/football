import io from "socket.io-client";
import {COMMANDS} from "../../constants";

const KEY_DOWN_EVENT_TO_COMMAND_MAPPING = {
  ArrowDown: COMMANDS.MOVE_PLAYER_DOWN,
  ArrowLeft: COMMANDS.MOVE_PLAYER_LEFT,
  ArrowRight: COMMANDS.MOVE_PLAYER_RIGHT,
  ArrowUp: COMMANDS.MOVE_PLAYER_UP,
};

export class ManualInputHandler {
  private socket: io;

  constructor(socket: io) {
    this.socket = socket;
  }

  private handleInput(event) {
    this.handleKeyDownEvent(event);
    event.preventDefault();
  }

  private handleKeyDownEvent(event) {
    const command = KEY_DOWN_EVENT_TO_COMMAND_MAPPING[event.code];
    if (command) {
      this.sendCommand(command);
    }
  }

  private sendCommand(command) {
    this.socket.emit("command", command);
  }
}
