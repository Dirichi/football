import { PlayerStateMachine } from '../../../../src/game_ai/player/state_machine/player_state_machine';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { PLAYER_MESSAGES } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let player: Player;

describe('PlayerStateMachine', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
  });

  afterEach(() => {
    player = null;
  });

  describe('`update`', () => {
    it('selects and applies the first eligilble state', () => {
      const ineligibleState = {
        eligibleFor: (player: Player) => { return false },
        update: (player: Player) => { return; },
      };

      const eligibleState = {
        eligibleFor: (player: Player) => { return true },
        update: (player: Player) => { return; },
      };

      sinon.spy(eligibleState, 'update');
      sinon.spy(ineligibleState, 'update');

      const states = [ineligibleState, eligibleState];
      const machine = new PlayerStateMachine(player, states);
      machine.update();

      expect(ineligibleState.update).not.to.have.been.called;
      expect(eligibleState.update).to.have.been.calledWith(player);
    });
  });
});
