import { PlayerStateMachine } from '../../../../src/game_ai/player/state_machine/player_state_machine';
import { IPlayerState } from '../../../../src/interfaces/iplayer_state';
import { IPlayerStateFeature } from '../../../../src/interfaces/iplayer_state_feature';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let player: Player;
let extractor = {
  hasBall: (player: Player) => false,
  hasGoodPassingOptions: (player: Player) => false,
  isInGoodShootingPosition: (player: Player) => false,
  isNearestTeamMateToBall: (player: Player) => false,
  teamInControl: (player: Player) => false,
};

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
        eligibleFor: (features: IPlayerStateFeature) => { return false },
        update: (player: Player, features: IPlayerStateFeature) => { ineligibleStateSpy(player, features) },
      };

      const eligibleStateSpy = sinon.spy();
      const eligibleState = {
        eligibleFor: (features: IPlayerStateFeature) => { return true },
        update: (player: Player, features: IPlayerStateFeature) => { eligibleStateSpy(player, features) },
      };

      const states = [ineligibleState, eligibleState];
      const machine = new PlayerStateMachine(player, states);
      machine.setFeatureExtractor(extractor);
      machine.update();

      const features = {
        hasBall: false,
        hasGoodPassingOptions: false,
        hasWaitMessages: false,
        isInGoodShootingPosition: false,
        isNearestTeamMateToBall: false,
        teamInControl: false,
      }
      expect(ineligibleStateSpy).not.to.have.been.called;
      expect(eligibleStateSpy).to.have.been.calledWith(player);
    });
  });
});
