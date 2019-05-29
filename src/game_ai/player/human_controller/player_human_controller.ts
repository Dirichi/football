import { Player } from "../../../game_objects/player";
import { ICommandRequest } from "../../../interfaces/icommand_request";
import { ICommandRequestHandler } from "../../../interfaces/icommand_request_handler";
import { IPlayerController } from "../../../interfaces/iplayer_controller";

type RequestRouter = Map<string, ICommandRequestHandler>;

export class PlayerHumanController implements IPlayerController {
  private player: Player;
  private commandRequestRouter: RequestRouter;
  private commandRequestList: ICommandRequest[];
  private enabled: boolean;

  constructor(player: Player, commandRequestRouter: RequestRouter) {
    this.player = player;
    this.commandRequestRouter = commandRequestRouter;
    this.commandRequestList = [];
    this.enabled = true;
  }

  public update(): void {
    if (!this.enabled) { return; }

    let request = this.commandRequestList.shift();
    while (request) {
      this.applyCommandRequest(request);
      request = this.commandRequestList.shift();
    }
  }

  public handleMessage(message: {details: string}): void {
    return;
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public handleCommandRequest(commandRequest: ICommandRequest): void {
    if (!this.enabled) { return; }
    this.commandRequestList.push(commandRequest);
  }

  private applyCommandRequest(commandRequest: ICommandRequest): void {
    const commandId = commandRequest.commandId as string;

    const routerEntries = [...this.commandRequestRouter.entries()];
    const matchingRouterEntry = routerEntries.find(([handlerKey, handler]) => {
      return commandId.match(handlerKey) !== null;
    });
    matchingRouterEntry[1].handle(commandRequest, this.player);
  }
}
