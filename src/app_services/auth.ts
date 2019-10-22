import express from "express";
import { Socket } from "socket.io";
import { GameRoom } from "../game_room";
import { ICustomizedRequest } from "../interfaces/icustomized_request";
import { ICustomizedSocket } from "../interfaces/icustomized_socket";
import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";
import { IUserAttributes } from "../interfaces/iuser_attributes";
import { GameSessionStore } from "../models/game_session_store";
import { UserStore } from "../models/user_store";
import { Logger } from "../utils/logger";

export function requiresLogin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction): void {
    authenticateRequest(req).then((authenticated) => {
    authenticated ? next() : res.redirect("/login");
  });
}

export async function authenticateSocket(
  socket: Socket, next: (err?: any) => void): Promise<void> {
  const userId = socket.handshake.session.userId;
  const roomId = getIntendedRoomIdFromSocket(socket);
  const participation = await findParticipation(userId, roomId);
  if (!participation) {
    Logger.log(`User ${userId} not allowed to join room ${roomId}`);
    return;
  }
  const customizedSocket = socket as ICustomizedSocket;
  customizedSocket.participation = participation;
  customizedSocket.gameRoom = GameRoom.find(roomId);
  next();
}

export async function authenticateRequest(req: express.Request): Promise<boolean> {
  if (!req.session.userId) { return Promise.resolve(false); }
  const user = await new UserStore().find(req.session.userId);
  if (!user) { return false; }
  (req as ICustomizedRequest).user = user;
  return true;
}

export async function login(req: express.Request): Promise<IUserAttributes> {
  const nickName = req.body.nickName as string;
  const userStore = new UserStore();
  let user = await userStore.findBy({ nickName });
  if (!user) { user = await userStore.create({ nickName }); }
  req.session.userId = user.id;
  (req as ICustomizedRequest).user = user;
  return user;
}

export async function findParticipation(
  userId: number, roomId: string): Promise<IParticipationAttributes> {
  const gameSession =
    await new GameSessionStore().findBy(
      { gameRoomId: roomId, participations: { userId } });
  if (!gameSession) { return null; }
  return gameSession.participations.find((p) => p.userId === userId);
}

function getIntendedRoomIdFromSocket(socket: Socket): string | null {
  const url = socket.handshake.headers.referer;
  const match = url.match(`.*/games/(.+)`, url);
  return match ? match[1] : null;
}
