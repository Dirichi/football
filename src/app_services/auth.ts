import express from "express";
import { Socket } from "socket.io";
import { GameRoom } from "../game_room";
import { ICustomizedRequest } from "../interfaces/icustomized_request";
import { ICustomizedSocket } from "../interfaces/icustomized_socket";
import { IUserAttributes } from "../interfaces/iuser_attributes";
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

export function authenticateSocket(
  socket: Socket, next: (err?: any) => void): void {
  const userId = socket.handshake.session.userId;
  const intendedRoom = getIntendedRoomFromSocket(socket);
  if (!(userId && intendedRoom)) {
    Logger.log(`User (${userId}) or room (${intendedRoom}) do not exist.`);
    return;
  }
  const userStore = new UserStore();
  userStore.find(userId).then((user) => {
    // PART
    // PARTFIX: Replace with a a query like Participation.findBy({userId: , gameRoom:})
    const allowedSocket = user && authorizeParticipation(user, intendedRoom);
    if (!allowedSocket) {
      Logger.log(
        `User ${userId} not allowed to join room ${intendedRoom.getId()}`);
      return;
    }
    const customizedSocket = socket as ICustomizedSocket;
    [customizedSocket.user, customizedSocket.gameRoom] = [user, intendedRoom];
    next();
  });
}

export async function authenticateRequest(req: express.Request): Promise<boolean> {
  if (!req.session.userId) { return Promise.resolve(false); }
  const userStore = new UserStore();
  const user = await userStore.find(req.session.userId);
  if (!user) {
    return false;
  }
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

// TODO: Promisify (?)
// PART
export function authorizeParticipation(
  user: IUserAttributes, intendedRoom: GameRoom): boolean {
    return intendedRoom.participations.some((participation) => {
    return participation.userId === user.id;
  });
}

function getIntendedRoomFromSocket(socket: Socket): GameRoom {
  const url = socket.handshake.headers.referer;
  const match = url.match(`.*/games/(.+)`, url);
  const roomId = match ? match[1] : null;
  if (roomId) { return GameRoom.find(roomId); }
  return null;
}
