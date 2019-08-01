// TODO: Avoid overwritting these interfaces and consider extending them.
import { User } from "./models/user";
import { GameRoom } from "./game_room";

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

declare global {
  namespace SocketIO {
    interface Socket {
      user?: User;
      gameRoom?: GameRoom;
    }
  }
}
