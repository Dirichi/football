import { CommandFactory } from '../../../../src/commands/command_factory';
import { AttackingRunState } from '../../../../src/game_ai/player/state_machine/attacking_run_state';
import { IPlayerStateFeatureExtractor } from '../../../../src/interfaces/iplayer_state_feature_extractor';
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
let getNewExtractor = () => {
  return {
    bestPositionOption: (player: Player) => bestPosition,
    bestPassingOption: (player: Player) => new Player(0, 0, 0, 0, 5),
    hasBall: (player: Player) => false,
    receivedWaitMessage: (player: Player) => false,
    isNearestTeamMateToBall: (player: Player) => false,
    shotValue: (player: Player) => 0,
    teamInControl: (player: Player) => false,
  } as IPlayerStateFeatureExtractor;
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
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'teamInControl').returns(true);
      sinon.stub(extractor, 'hasBall').returns(false);
      sinon.spy(player, 'moveTowards');
      const state = new AttackingRunState(commandFactory, extractor);

      state.update(player);

      expect(player.moveTowards).to.have.been.calledWith(bestPosition);
    });

    it('does nothing if the team does not have the ball', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'teamInControl').returns(false);
      sinon.stub(extractor, 'hasBall').returns(false);
      sinon.stub(player, 'moveTowards');
      const state = new AttackingRunState(commandFactory, extractor);

      state.update(player);

      expect(player.moveTowards).not.to.have.been.called;
    });

    it('does nothing if the player is with the ball', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'teamInControl').returns(true);
      sinon.stub(extractor, 'hasBall').returns(true);
      sinon.stub(player, 'moveTowards');
      const state = new AttackingRunState(commandFactory, extractor);

      state.update(player);

      expect(player.moveTowards).not.to.have.been.called;
    });
  });
});
