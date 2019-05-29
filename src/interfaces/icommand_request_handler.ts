import { Player } from "../game_objects/player";
import { ICommandRequest } from "./icommand_request";

export interface ICommandRequestHandler {
  handle(command: ICommandRequest, player: Player): void;
}
