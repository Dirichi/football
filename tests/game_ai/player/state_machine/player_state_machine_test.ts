import { PlayerStateMachine } from '../../../../src/game_ai/player/state_machine/player_state_machine';
import { IPlayerStateFeature } from '../../../../src/interfaces/iplayer_state_feature';
import { Player } from '../../../../src/game_objects/player';
import { ThreeDimensionalVector } from '../../../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { STATE_MACHINE_COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let player: Player;
const bestPassingOption = new Player(0, 0, 0, 0, 5);
const bestPosition = new ThreeDimensionalVector(0, 0, 0);
let extractor = {
  bestPositionOption: (player: Player) => bestPosition,
  bestPassingOption: (player: Player) => bestPassingOption,
  hasBall: (player: Player) => false,
  isNearestTeamMateToBall: (player: Player) => false,
  hasOpenPassingOptions: (player: Player) => false,
  shotValue: (player: Player) => 0,
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
        update: (player: Player, features: IPlayerStateFeature) => {
          ineligibleStateSpy(player, features)
        },
      };

      const eligibleStateSpy = sinon.spy();
      const eligibleState = {
        eligibleFor: (features: IPlayerStateFeature) => { return true },
        update: (player: Player, features: IPlayerStateFeature) => {
          eligibleStateSpy(player, features)
        },
      };

      const states = [ineligibleState, eligibleState];
      const machine = new PlayerStateMachine(player, states);
      machine.setFeatureExtractor(extractor);
      machine.update();

      const features = {
        bestPositionOption: new ThreeDimensionalVector(0, 0, 0),
        bestPassingOption: bestPassingOption,
        hasBall: false,
        hasOpenPassingOptions: false,
        isNearestTeamMateToBall: false,
        hasWaitMessages: false,
        shotValue: 0,
        teamInControl: false,
      }

      expect(ineligibleStateSpy).not.to.have.been.called;
      expect(eligibleStateSpy).to.have.been.calledWith(player, features);
    });
  });

  describe('`handleMessage`', () => {
    it('pushes a WAIT message unto `messages`', () => {
      const stateA = {
        eligibleFor: (features: IPlayerStateFeature) => { return false },
        update: (player: Player, features: IPlayerStateFeature) => {},
      };

      const stateB = {
        eligibleFor: (features: IPlayerStateFeature) => { return true },
        update: (player: Player, features: IPlayerStateFeature) => {},
      };

      const machine = new PlayerStateMachine(player, [stateA, stateB]);
      machine.setFeatureExtractor(extractor);
      machine.handleMessage({details: STATE_MACHINE_COMMANDS.WAIT});

      expect(machine.getMessages()).to.eql([STATE_MACHINE_COMMANDS.WAIT]);
    });

    it('removes WAIT messages when a NO_NEED_TO_WAIT message is received',
      () => {
        const stateA = {
          eligibleFor: (features: IPlayerStateFeature) => { return false },
          update: (player: Player, features: IPlayerStateFeature) => {},
        };

        const stateB = {
          eligibleFor: (features: IPlayerStateFeature) => { return true },
          update: (player: Player, features: IPlayerStateFeature) => {},
        };

        const machine = new PlayerStateMachine(player, [stateA, stateB]);
        machine.setFeatureExtractor(extractor);
        machine.handleMessage({details: STATE_MACHINE_COMMANDS.WAIT});
        machine.handleMessage({details: STATE_MACHINE_COMMANDS.WAIT});
        machine.handleMessage(
            {details: STATE_MACHINE_COMMANDS.NO_NEED_TO_WAIT});

        expect(machine.getMessages()).to.eql([]);
    });
  });
});
