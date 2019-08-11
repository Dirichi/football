import express from "express";
import { Socket } from "socket.io";
import { GameRoom } from "../game_room";
import { ICustomizedRequest } from "../interfaces/icustomized_request";
import { ICustomizedSocket } from "../interfaces/icustomized_socket";
import { User } from "../models/user";

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
    if (!(userId && intendedRoom)) { return; }
    User.find(userId).then((user) => {
      const allowedSocket = user && authorizeParticipation(user, intendedRoom);
      if (!allowedSocket) { return; }
      const customizedSocket = socket as ICustomizedSocket;
      [customizedSocket.user, customizedSocket.gameRoom] = [user, intendedRoom];
      next();
    });
}

export function authenticateRequest(req: express.Request): Promise<boolean> {
  const userId = req.session.userId;
  if (!userId) { return Promise.resolve(false); }
  return User.find(userId).then((user) => {
    if (!user) { return false; }
    (req as ICustomizedRequest).user = user;
    return true;
  });
}

export function login(req: express.Request): Promise<User> {
  const nickName = req.body.nickName;
  return User.findOrCreateBy({ nickName }).then((user) => {
    req.session.userId = user.id;
    (req as ICustomizedRequest).user = user;
    return user;
  });
}

// TODO: Promisify (?)
export function authorizeParticipation(
  user: User, intendedRoom: GameRoom): boolean {
    return intendedRoom.participations.some((participation) => {
      return participation.userId === user.id;
    });
}

function getIntendedRoomFromSocket(socket: Socket): GameRoom {
  const url = socket.handshake.headers.referer;
  const host = "http://localhost:3000";
  const match = url.match(`${host}/games/(.+)`, url);
  const roomId =  match ? match[1] : null;
  if (roomId) { return GameRoom.find(roomId); }
  return null;
}
