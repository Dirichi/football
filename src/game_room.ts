export class GameRoom {

  public static findById(gameId: string) {
    const rooms = [...this.socketsByGameRoom.keys()];
    const matchingGameRoom = rooms.find((room) => room.getId() === gameId);
    return matchingGameRoom;
  }

  public static findBySocketId(socketId: string) {
    const rooms = [...this.socketsByGameRoom.keys()];
    const matchingGameRoom = rooms.find((room) => {
      return this.socketsByGameRoom.get(room).includes(socketId);
    });

    return matchingGameRoom;
  }

  public static addSocketToGameRoom(socketId: string, game: GameRoom) {
    GameRoom.socketsByGameRoom.get(game).push(socketId);
  }
  private static socketsByGameRoom = new Map<GameRoom, string[]>();

  private id: string;
  private started: boolean;

  constructor(id: string) {
    this.id = id;
    this.started = false;
    GameRoom.socketsByGameRoom.set(this, []);
  }

  public add(socketId: string) {
    GameRoom.addSocketToGameRoom(socketId, this);
  }

  public getId() {
    return this.id;
  }

  public start() {
    this.started = true;
  }

  public hasStarted() {
    return this.started;
  }
}
