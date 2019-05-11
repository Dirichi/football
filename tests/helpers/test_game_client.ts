import { IGameClient } from "../../src/interfaces/igame_client";
import { IO_MESSAGE_TYPE } from "../../src/constants";
import { GameRoom } from "../../src/game_room";

export class TestGameClient implements IGameClient {
  private room?: GameRoom;

  public send(messageType: IO_MESSAGE_TYPE, message: any): void {
    return;
  }

  public setRoom(room: GameRoom): void {
    this.room = room;
  }

  public getRoom(): GameRoom | null {
    return this.room || null;
  }
}
