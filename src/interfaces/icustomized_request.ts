import { Request } from "express";
import { IUserAttributes } from "./iuser_attributes";

export interface ICustomizedRequest extends Request {
  user?: IUserAttributes;
}
