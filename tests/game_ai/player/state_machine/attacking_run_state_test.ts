import { CommandFactory } from '../../../../src/commands/command_factory';
import { AttackingRunState } from '../../../../src/game_ai/player/state_machine/attacking_run_state';
import { IPlayerStateFeature } from '../../../../src/interfaces/iplayer_state_feature';
import { Player } from '../../../../src/game_objects/player';
import { Vector3D } from '../../../../src/three_dimensional_vector';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMAND_ID } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const bestPosition = new Vector3D(0, 0, 0);
let commandFactory: CommandFactory;
let player: Player;
let getNewFeatures = () => {
  return {
    bestPositionOption: bestPosition,
    bestPassingOption: new Player(0, 0, 0, 0, 5),
    hasBall: false,
    hasWaitMessages: false,
    isNearestTeamMateToBall: false,
    shotValue: 0,
    teamInControl: false,
  } as IPlayerStateFeature;
};

describe('AttackingRunState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a moveTowardsAttackingPosition command if eligilble', () => {
        const state = new AttackingRunState(commandFactory);
        const features = getNewFeatures();
        features.teamInControl = true;
        features.hasBall = false;
        sinon.stub(player, 'moveTowards');

        state.update(player, features);

        expect(player.moveTowards).to.have.been.calledWith(bestPosition);
    });

    it('does nothing if the team does not have the ball', () => {
      const state = new AttackingRunState(commandFactory);

      const features = getNewFeatures();
      features.teamInControl = false;
      features.hasBall = false;
      sinon.stub(player, 'moveTowards');

      state.update(player, features);

      expect(player.moveTowards).not.to.have.been.called;
    });

    it('does nothing if the player is with the ball', () => {
      const state = new AttackingRunState(commandFactory);

      const features = getNewFeatures();
      features.teamInControl = true;
      features.hasBall = true;
      sinon.stub(player, 'moveTowards');

      state.update(player, features);

      expect(player.moveTowards).not.to.have.been.called;
    });
  });
});
