import { CommandFactory } from '../../../../src/commands/command_factory';
import { WaitingState } from '../../../../src/game_ai/player/state_machine/waiting_state';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let commandFactory: CommandFactory;
let player: Player;

describe('WaitingState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a stop command if eligilble', () => {
        const state = new WaitingState(commandFactory);
        sinon.stub(player, 'hasWaitMessages').returns(true);
        sinon.stub(player, 'hasBall').returns(false);
        sinon.stub(player, 'teamInControl').returns(true);

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMANDS.STOP)
          .returns(command);

        state.update(player);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('clears the player\'s wait messages if the player has the ball',
        () => {
          const state = new WaitingState(commandFactory);
          sinon.stub(player, 'hasWaitMessages').returns(true);
          sinon.stub(player, 'hasBall').returns(true);
          sinon.stub(player, 'teamInControl').returns(true);

          const clearWaitMessagesStub = sinon.stub(player, 'clearWaitMessages');

          state.update(player);
          expect(clearWaitMessagesStub).to.have.been.called;
    });

    it('clears the player\'s wait messages if the it\'s team looses control',
        () => {
          const state = new WaitingState(commandFactory);
          sinon.stub(player, 'hasWaitMessages').returns(true);
          sinon.stub(player, 'hasBall').returns(true);
          sinon.stub(player, 'teamInControl').returns(true);

          const clearWaitMessagesStub = sinon.stub(player, 'clearWaitMessages');

          state.update(player);
          expect(clearWaitMessagesStub).to.have.been.called;
    });

    it('does not call a command if the player\'s team looses control', () => {
      const state = new WaitingState(commandFactory);
      sinon.stub(player, 'hasWaitMessages').returns(true);
      sinon.stub(player, 'hasBall').returns(false);
      sinon.stub(player, 'teamInControl').returns(false);

      const getCommandStub = sinon.stub(commandFactory, 'getCommand')
      state.update(player);

      expect(getCommandStub).not.to.have.been.called;
    });

    it('does not call a command if the player has the ball', () => {
      const state = new WaitingState(commandFactory);
      sinon.stub(player, 'hasWaitMessages').returns(true);
      sinon.stub(player, 'hasBall').returns(true);
      sinon.stub(player, 'teamInControl').returns(false);

      const getCommandStub = sinon.stub(commandFactory, 'getCommand')
      state.update(player);

      expect(getCommandStub).not.to.have.been.called;
    });

    it('does nothing if the player does not have wait messages', () => {
      const state = new WaitingState(commandFactory);
      sinon.stub(player, 'hasWaitMessages').returns(false);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.STOP)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
