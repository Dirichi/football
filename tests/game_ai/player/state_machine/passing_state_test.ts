import { CommandFactory } from '../../../../src/commands/command_factory';
import { IPlayerStateFeatureExtractor } from '../../../../src/interfaces/iplayer_state_feature_extractor';
import { PassingState } from '../../../../src/game_ai/player/state_machine/passing_state';
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

describe('PassingState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a pass command if eligilble', () => {
      const bestPassOption = new Player(0, 0, 0, 0, 5);
      const extractor = new TestPlayerStateFeatureExtractor();
      sinon.stub(extractor, 'hasBall').returns(true);
      sinon.stub(extractor, 'bestPassingOption').returns(bestPassOption);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.PASS_BALL)
        .returns(command);
      const state = new PassingState(commandFactory, extractor);

      state.update(player);

      expect(command.execute).to.have.been.calledWith(player, bestPassOption);
    });

    it('does nothing if the player does not have the ball', () => {
      const extractor = new TestPlayerStateFeatureExtractor();
      sinon.stub(extractor, 'hasBall').returns(false);
      const state = new PassingState(commandFactory, extractor);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.PASS_BALL)
        .returns(command);

      state.update(player);

      expect(command.execute).not.to.have.been.called;
    });
  });
});
