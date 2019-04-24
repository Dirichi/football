import { PlayerStateMachine } from '../../../../src/game_ai/player/state_machine/player_state_machine';
import { IPlayerState } from '../../../../src/interfaces/iplayer_state';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMANDS } from '../../../../src/constants';

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
      const ineligibleStateSpy = sinon.spy();
      const ineligibleState = {
        eligibleFor: (player: Player) => { return false },
        update: (player: Player) => { ineligibleStateSpy() },
      };

      const eligibleStateSpy = sinon.spy();
      const eligibleState = {
        eligibleFor: (player: Player) => { return true },
        update: (player: Player) => { eligibleStateSpy(player) },
      };

      const states = [ineligibleState, eligibleState];
      const machine = new PlayerStateMachine(player, states);
      machine.update();

      expect(ineligibleStateSpy).not.to.have.been.called;
      expect(eligibleStateSpy).to.have.been.calledWith(player);
    });
  });
});
