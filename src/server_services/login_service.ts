import express from "express";
import { User } from "../models/user";
import { UserStorage } from "../storage/user_storage";

export function requiresLogin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction): void {
    if (!isLoggedIn(req)) {
      res.redirect("login");
    } else {
      next();
    }
}

export function authenticate(req: express.Request): Promise<boolean> {
  const userId = req.session.userId;
  if (!userid) { return Promise.resolve(false); }
  User.find(userId).then((user) => {
    if (!user) { return false; }
    req.user = user;
    return true;
  });
}

// TODO: Validate if the userid is actually exists in the database.
export function isLoggedIn(req: express.Request): boolean {
  const userId = req.session.userId;
  return !!userId;
}

export class LoginService {
  constructor(private userStorage: UserStorage) {}
  public login(req: express.Request): Promise<User> {
    const nickName = req.body.nickName;
    return this.userStorage.findOrCreateBy({ nickName }).then((user) => {
      req.session.userId = user.id;
      return Promise.resolve(user);
    });
  }
}
