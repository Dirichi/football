import { EventQueue } from "../../src/event_queue";
import { IGameClient } from "../../src/interfaces/igame_client";
import { ICommandRequest } from "../../src/interfaces/icommand_request";
import { COMMAND_ID, IO_MESSAGE_TYPE } from "../../src/constants";

export class TestGameClient implements IGameClient {
  private id: string;
  private queue: EventQueue;

  constructor(id: string) {
    this.id = id;
    this.queue = new EventQueue();
  }

  public updateGameState(payload: object) {
    this.queue.trigger(IO_MESSAGE_TYPE.GAME_STATE, payload);
  }

  public onCommandRequest(callback: (payload: ICommandRequest) => void): void {
    this.queue.when(IO_MESSAGE_TYPE.COMMAND, callback);
  }

  public simulateCommandRequest(request: {commandId: string}): void {
    const command = {...request, clientId: this.id}
    this.queue.trigger(IO_MESSAGE_TYPE.COMMAND, command);
  }

  public getId(): string {
    return this.id;
  }
}
