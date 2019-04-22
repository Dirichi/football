import { MoveDownCommand } from "./move_down_command";
import { MoveUpCommand } from "./move_up_command";
import { MoveLeftCommand } from "./move_left_command";
import { MoveRightCommand } from "./move_right_command";
import { MoveToAttackingPositionCommand } from "./move_to_attacking_position_command";
import { MoveToDefensivePositionCommand } from "./move_to_defensive_position_command";
import { ShootBallCommand } from "./shoot_ball_command";
import { PassBallCommand } from "./pass_ball_command";
import { ChaseBallCommand } from "./chase_ball_command";
import { ICommand } from "../interfaces/icommand";
import { ICommandFactory } from "../interfaces/icommand_factory";

export class CommandFactory implements ICommandFactory {
  public getCommand(commandName: string): ICommand {
    return new MoveUpCommand();
  }
}
