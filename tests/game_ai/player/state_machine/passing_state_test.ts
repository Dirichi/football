import { CommandFactory } from '../../../../src/commands/command_factory';
import { PassingState } from '../../../../src/game_ai/player/state_machine/passing_state';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let commandFactory: CommandFactory;
let player: Player;

describe('PassingState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a pass command if eligilble', () => {
        const state = new PassingState(commandFactory);
        sinon.stub(player, 'hasBall').returns(true);
        sinon.stub(player, 'hasGoodPassingOptions').returns(true);

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMANDS.PASS_BALL)
          .returns(command);

        state.update(player);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('does nothing if the player does not have the ball', () => {
      const state = new PassingState(commandFactory);
      sinon.stub(player, 'hasBall').returns(false);
      sinon.stub(player, 'hasGoodPassingOptions').returns(true);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.PASS_BALL)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });

    it('does nothing if the player does not have good passing options', () => {
      const state = new PassingState(commandFactory);
      sinon.stub(player, 'hasBall').returns(false);
      sinon.stub(player, 'hasGoodPassingOptions').returns(true);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.PASS_BALL)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
