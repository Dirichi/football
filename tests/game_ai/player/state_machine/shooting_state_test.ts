import { CommandFactory } from '../../../../src/commands/command_factory';
import { ShootingState } from '../../../../src/game_ai/player/state_machine/shooting_state';
import { Player } from '../../../../src/game_objects/player';
import { IPlayerStateFeatureExtractor } from '../../../../src/interfaces/iplayer_state_feature_extractor';
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

describe('ShootingState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a shoot command if eligilble', () => {
      const shotTarget = new Vector3D(1, 1, 1);
      const extractor = new TestPlayerStateFeatureExtractor();
      sinon.stub(extractor, 'bestShotTargetOption').returns(shotTarget);
      sinon.stub(extractor, 'hasBall').returns(true);
      sinon.stub(extractor, 'bestShotValue').returns(0.9); // 0.9 > threshold (0.8)
      const state = new ShootingState(commandFactory, extractor, 0.8);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.SHOOT_BALL)
        .returns(command);

      state.update(player);

      expect(command.execute).to.have.been.calledWith(player, shotTarget);
    });

    it('does nothing if the player does not have the ball', () => {
      const extractor = new TestPlayerStateFeatureExtractor();
      sinon.stub(extractor, 'hasBall').returns(false);
      sinon.stub(extractor, 'bestShotValue').returns(0.9);
      const state = new ShootingState(commandFactory, extractor, 0.8);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.SHOOT_BALL)
        .returns(command);

      state.update(player);

      expect(command.execute).not.to.have.been.called;
    });

    it('does nothing if the shotValue is below the specified threshold', () => {
      const extractor = new TestPlayerStateFeatureExtractor();
      sinon.stub(extractor, 'hasBall').returns(true);
      sinon.stub(extractor, 'bestShotValue').returns(0.7);
      const state = new ShootingState(commandFactory, extractor, 0.8);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.SHOOT_BALL)
        .returns(command);

      state.update(player);

      expect(command.execute).not.to.have.been.called;
    });
  });
});
