import { CommandFactory } from '../../../../src/commands/command_factory';
import { DribblingState } from '../../../../src/game_ai/player/state_machine/dribbling_state';
import { Player } from '../../../../src/game_objects/player';
import { IPlayerStateFeatureExtractor } from '../../../../src/interfaces/iplayer_state_feature_extractor';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMAND_ID } from '../../../../src/constants';
import { Vector3D } from '../../../../src/three_dimensional_vector';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const bestDribbleOption = new Vector3D(0, 0, 0);
let commandFactory: CommandFactory;
let getNewExtractor = () => {
  return {
    bestDribbleValue: (player: Player) => 0.5,
    bestDribbleOption: (player: Player) => bestDribbleOption,
    bestPassValue: (player: Player) => 0.5,
    bestPositionOption: (player: Player) => new Vector3D(0, 0, 0),
    bestPassingOption: (player: Player) => new Player(0, 0, 0, 0, 5),
    hasBall: (player: Player) => false,
    receivedWaitMessage: (player: Player) => false,
    isNearestTeamMateToBall: (player: Player) => false,
    shotValue: (player: Player) => 0,
    teamInControl: (player: Player) => false,
  } as IPlayerStateFeatureExtractor;
};
let player: Player;

describe('DribblingState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('moves the player towards the best dribbling option', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'hasBall').returns(true);
      sinon.stub(extractor, 'bestDribbleValue').returns(0.8);
      sinon.stub(extractor, 'bestPassValue').returns(0.7);
      sinon.spy(player, 'moveTowards');
      const state = new DribblingState(commandFactory, extractor);

      state.update(player);

      expect(player.moveTowards).to.have.been.calledWith(bestDribbleOption);
    });

    it('does nothing if the player does not have the ball', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'hasBall').returns(false);
      const state = new DribblingState(commandFactory, extractor);
      sinon.spy(player, 'moveTowards');

      state.update(player);

      expect(player.moveTowards).not.to.have.been.called;
    });

    it('does nothing if passing is objectively better than dribbling', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'hasBall').returns(true);
      sinon.stub(extractor, 'bestDribbleValue').returns(0.7);
      sinon.stub(extractor, 'bestPassValue').returns(0.8);
      sinon.spy(player, 'moveTowards');
      const state = new DribblingState(commandFactory, extractor);

      state.update(player);

      expect(player.moveTowards).not.to.have.been.called;
    });
  });
});
