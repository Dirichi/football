import { CommandFactory } from '../../../../src/commands/command_factory';
import { ChasingBallState } from '../../../../src/game_ai/player/state_machine/chasing_ball_state';
import { IPlayerStateFeatureExtractor } from '../../../../src/interfaces/iplayer_state_feature_extractor';
import { Player } from '../../../../src/game_objects/player';
import { Vector3D } from '../../../../src/three_dimensional_vector';

import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMAND_ID } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let commandFactory: CommandFactory;
let player: Player;
let getNewExtractor = () => {
  return {
    bestPositionOption: (player: Player) => new Vector3D(0, 0, 0),
    bestPassingOption: (player: Player) => new Player(0, 0, 0, 0, 5),
    hasBall: (player: Player) => false,
    receivedWaitMessage: (player: Player) => false,
    isNearestTeamMateToBall: (player: Player) => false,
    shotValue: (player: Player) => 0,
    teamInControl: (player: Player) => false,
  } as IPlayerStateFeatureExtractor;
};

describe('ChasingBallState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a ChaseBallCommand if eligilble', () => {
        const extractor = getNewExtractor();
        sinon.stub(extractor, 'teamInControl').returns(false)
        sinon.stub(extractor, 'isNearestTeamMateToBall').returns(true)
        const state = new ChasingBallState(commandFactory, extractor);

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMAND_ID.CHASE_BALL)
          .returns(command);

        state.update(player);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('does nothing if the team has the ball', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'teamInControl').returns(true);
      sinon.stub(extractor, 'isNearestTeamMateToBall').returns(false);
      const state = new ChasingBallState(commandFactory, extractor);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.CHASE_BALL)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });

    it('does nothing if the player is not the nearest to the ball', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'teamInControl').returns(false);
      sinon.stub(extractor, 'isNearestTeamMateToBall').returns(false);
      const state = new ChasingBallState(commandFactory, extractor);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.CHASE_BALL)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
