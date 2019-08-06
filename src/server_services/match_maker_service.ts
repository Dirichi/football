import path from "path";
import { GAME_EXECUTABLE_FILE, PLAYER_ROLE_TYPE } from "../constants";
import { GameRoom } from "../game_room";
import { User } from "../models/user";
import { WrappedProcessForker } from "../wrapped_process_forker";

export class MatchMakerService {
  // TODO: Do not create a GameRoom everytime. First search for one matching
  // the provided criteria which has not been locked, and if none found, create
  // a new one.
  public match(
    request: {user: User, roleType: PLAYER_ROLE_TYPE}): Promise<GameRoom|null> {
    const room = new GameRoom();
    room.setProcessForker(new WrappedProcessForker());
    room.setGameExecutablePath(path.join(process.cwd(), GAME_EXECUTABLE_FILE));
    room.addParticipation(
      {userId: request.user.id, roleType: request.roleType});
    room.save();
    return Promise.resolve(room);
  }
}
