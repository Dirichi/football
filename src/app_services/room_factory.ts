import path from "path";
import { GAME_EXECUTABLE_FILE } from "../constants";
import { GameRoom } from "../game_room";
import { IGameSessionAttributes } from "../interfaces/igame_session_attributes";
import { GameSessionStore } from "../models/game_session_store";
import { ParticipationStore } from "../models/participation_store";
import { WrappedProcessForker } from "../wrapped_process_forker";

export class RoomFactory {
  public findOrCreateFromSession(
    gameSession: IGameSessionAttributes): GameRoom {
      const room = GameRoom.find(gameSession.gameRoomId);
      return room ? room : this.createRoom(gameSession);
  }

  private createRoom(gameSession: IGameSessionAttributes): GameRoom {
    const room = new GameRoom(gameSession.gameRoomId);
    room.setProcessForker(new WrappedProcessForker());
    room.setGameExecutablePath(path.join(process.cwd(), GAME_EXECUTABLE_FILE));
    room.setGameSessionStore(new GameSessionStore());
    room.setParticipationStore(new ParticipationStore());
    room.save();
    return room;
  }
}
