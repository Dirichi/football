import { Request } from "express";
import { User } from "../models/user";

export interface ICustomizedRequest extends Request {
  user?: User;
}
