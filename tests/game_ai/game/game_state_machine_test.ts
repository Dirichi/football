import { Game } from '../../../src/game';
import { GameStateMachine } from '../../../src/game_ai/game/game_state_machine';
import { TestGameState } from '../../helpers/test_game_state';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('GameStateMachine', () => {
  describe('`update`', () => {
    it('`enters` the initial state before updating it', () => {
      const game = new Game();
      const initialState = new TestGameState();
      const machine = new GameStateMachine(initialState);

      sinon.spy(initialState, 'enter');
      machine.update(game);

      expect(initialState.enter).to.have.been.calledWith(game);
    });

    it('calls update on the current state', () => {
      const game = new Game();
      const initialState = new TestGameState();
      const machine = new GameStateMachine(initialState);

      sinon.spy(initialState, 'update');
      machine.update(game);

      expect(initialState.update).to.have.been.calledWith(game);
    });

    it('updates `state` if the current state returns a new state', () => {
      const game = new Game();
      const initialState = new TestGameState();
      const machine = new GameStateMachine(initialState);

      const nextState = new TestGameState();
      sinon.stub(initialState, 'update').returns(nextState);
      machine.update(game);

      expect(machine.getState()).to.equal(nextState);
    });

    it('`enters` new state', () => {
      const game = new Game();
      const initialState = new TestGameState();
      const machine = new GameStateMachine(initialState);

      const nextState = new TestGameState();
      sinon.stub(initialState, 'update').returns(nextState);
      sinon.spy(nextState, 'enter');
      machine.update(game);

      expect(nextState.enter).to.have.been.calledWith(game);
    });

    it('`exits` the old state', () => {
      const game = new Game();
      const initialState = new TestGameState();
      const machine = new GameStateMachine(initialState);

      const nextState = new TestGameState();
      sinon.stub(initialState, 'update').returns(nextState);
      sinon.spy(initialState, 'exit');
      machine.update(game);

      expect(initialState.exit).to.have.been.calledWith(game);
    });

    it('does not update `state` if the current state returns null', () => {
      const game = new Game();
      const initialState = new TestGameState();
      const machine = new GameStateMachine(initialState);

      sinon.stub(initialState, 'update').returns(null);
      machine.update(game);

      expect(machine.getState()).to.equal(initialState);
    });
  });
});
