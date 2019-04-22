import { CommandFactory } from '../../../../src/commands/command_factory';
import { AttackingRunState } from '../../../../src/game_ai/player/state_machine/attacking_run_state';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let commandFactory: CommandFactory;
let player: Player;

describe('AttackingRunState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory();
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a moveTowardsAttackingPosition command if eligilble', () => {
        const state = new AttackingRunState(commandFactory);
        sinon.stub(player, 'teamHasBall').returns(true);
        sinon.stub(player, 'hasBall').returns(false);

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMANDS.MOVE_TO_ATTACKING_POSITION)
          .returns(command);

        state.update(player);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('does nothing if the team does not have the ball', () => {
      const state = new AttackingRunState(commandFactory);
      sinon.stub(player, 'teamHasBall').returns(false);
      sinon.stub(player, 'hasBall').returns(false);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.MOVE_TO_ATTACKING_POSITION)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });

    it('does nothing if the player is with the ball', () => {
      const state = new AttackingRunState(commandFactory);
      sinon.stub(player, 'teamHasBall').returns(true);
      sinon.stub(player, 'hasBall').returns(true);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.MOVE_TO_ATTACKING_POSITION)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
