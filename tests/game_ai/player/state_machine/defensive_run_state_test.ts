import { CommandFactory } from '../../../../src/commands/command_factory';
import { DefensiveRunState } from '../../../../src/game_ai/player/state_machine/defensive_run_state';
import { IPlayerStateFeatureExtractor } from '../../../../src/interfaces/iplayer_state_feature_extractor';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMAND_ID } from '../../../../src/constants';
import { Vector3D } from '../../../../src/three_dimensional_vector';
import { TestPlayerStateFeatureExtractor } from "../../../helpers/test_player_state_feature_extractor";

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let commandFactory: CommandFactory;
let player: Player;

describe('DefensiveRunState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a moveTowardsDefensivePosition command if eligilble', () => {
      const bestDefencePositionOption = new Vector3D(5, 5, 5);
      const extractor = new TestPlayerStateFeatureExtractor();
      sinon.stub(extractor, 'teamInControl').returns(false);
      sinon.stub(extractor, 'isEligibleToMark').returns(false);
      sinon.stub(extractor, 'bestDefencePositionOption')
        .returns(bestDefencePositionOption);
      const state = new DefensiveRunState(commandFactory, extractor);
      sinon.stub(player, 'moveTowards');

      state.update(player);
      expect(player.moveTowards).to.have.been.calledWith(
        bestDefencePositionOption);
    });

    it('does nothing if the team has the ball', () => {
      const extractor = new TestPlayerStateFeatureExtractor();
      sinon.stub(extractor, 'teamInControl').returns(true);
      sinon.stub(extractor, 'isEligibleToMark').returns(false);
      const state = new DefensiveRunState(commandFactory, extractor);
      sinon.stub(player, 'moveTowards');

      state.update(player);
      expect(player.moveTowards).not.to.have.been.called;
    });

    it('does nothing if the player is the nearest to the ball', () => {
      const extractor = new TestPlayerStateFeatureExtractor();
      sinon.stub(extractor, 'teamInControl').returns(false);
      sinon.stub(extractor, 'isEligibleToMark').returns(true);
      const state = new DefensiveRunState(commandFactory, extractor);
      sinon.stub(player, 'moveTowards');

      state.update(player);
      expect(player.moveTowards).not.to.have.been.called;
    });
  });
});
