import { COMMAND_ID } from '../../src/constants';
import { ICommand } from '../../src/interfaces/icommand';
import { ICommandFactory } from '../../src/interfaces/icommand_factory';
import { MovePlayerRemoteCommandRequestHandler } from '../../src/commands/move_player_remote_command_request_handler';
import { Player } from '../../src/game_objects/player';
import { Vector3D } from '../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('MovePlayerRemoteCommandRequestHandler', () => {
  describe('`handle`', () => {
    it('executes a move command with the right direction', () => {
      const commandByDirectionMapping: Map<COMMAND_ID, Vector3D> =
        new Map([
          [COMMAND_ID.MOVE_PLAYER_UP, new Vector3D(0, -1, 0)],
          [COMMAND_ID.MOVE_PLAYER_UPPER_LEFT,
            new Vector3D(-1, -1, 0)],
          [COMMAND_ID.MOVE_PLAYER_UPPER_RIGHT,
            new Vector3D(1, -1, 0)],
          [COMMAND_ID.MOVE_PLAYER_DOWN, new Vector3D(0, 1, 0)],
          [COMMAND_ID.MOVE_PLAYER_LOWER_LEFT,
            new Vector3D(-1, 1, 0)],
          [COMMAND_ID.MOVE_PLAYER_LOWER_RIGHT,
            new Vector3D(1, 1, 0)],
          [COMMAND_ID.MOVE_PLAYER_LEFT, new Vector3D(-1, 0, 0)],
          [COMMAND_ID.MOVE_PLAYER_RIGHT, new Vector3D(1, 0, 0)],
        ]);

      const moveCommandMock = {
        execute: (player: Player, direction: Vector3D) => {
          return;
        }
      } as ICommand;

      const factoryMock = {
        getCommand: (commandId: COMMAND_ID): ICommand => {
          return moveCommandMock;
        }
      } as ICommandFactory;

      sinon.spy(factoryMock, 'getCommand');
      sinon.spy(moveCommandMock, 'execute');
      const player = new Player(0, 0, 0, 0, 0);
      const handler = new  MovePlayerRemoteCommandRequestHandler(factoryMock);

      commandByDirectionMapping.forEach((expectedDirection, commandId) => {
        handler.handle({ commandId: commandId, clientId: '_' }, player);
        expect(factoryMock.getCommand).to.have.been.calledWith(COMMAND_ID.MOVE);
        expect(moveCommandMock.execute).to.have.been.calledWith(
          player, sinon.match((actualDirection) => {
            return expectedDirection.equals(actualDirection);
          }));
      });
    })
  });
});
