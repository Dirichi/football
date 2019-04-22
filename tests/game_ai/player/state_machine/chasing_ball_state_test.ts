import { CommandFactory } from '../../../../src/commands/command_factory';
import { ChasingBallState } from '../../../../src/game_ai/player/state_machine/chasing_ball_state';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let commandFactory: CommandFactory;
let player: Player;

describe('ChasingBallState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory();
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a ChaseBallCommand if eligilble', () => {
        const state = new ChasingBallState(commandFactory);
        sinon.stub(player, 'teamHasBall').returns(false);
        sinon.stub(player, 'isNearestTeamMateToBall').returns(true);

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMANDS.CHASE_BALL)
          .returns(command);

        state.update(player);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('does nothing if the team has the ball', () => {
      const state = new ChasingBallState(commandFactory);
      sinon.stub(player, 'teamHasBall').returns(true);
      sinon.stub(player, 'isNearestTeamMateToBall').returns(false);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.CHASE_BALL)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });

    it('does nothing if the player is not the nearest to the ball', () => {
      const state = new ChasingBallState(commandFactory);
      sinon.stub(player, 'teamHasBall').returns(false);
      sinon.stub(player, 'isNearestTeamMateToBall').returns(false);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.CHASE_BALL)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
