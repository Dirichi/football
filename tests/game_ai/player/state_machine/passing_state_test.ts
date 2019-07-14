import { CommandFactory } from '../../../../src/commands/command_factory';
import { IPlayerStateFeatureExtractor } from '../../../../src/interfaces/iplayer_state_feature_extractor';
import { PassingState } from '../../../../src/game_ai/player/state_machine/passing_state';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMAND_ID } from '../../../../src/constants';
import { Vector3D } from '../../../../src/three_dimensional_vector';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const bestPassOption = new Player(0, 0, 0, 0, 5);
let commandFactory: CommandFactory;
let getNewExtractor = () => {
  return {
    bestPositionOption: (player: Player) => new Vector3D(0, 0, 0),
    bestPassingOption: (player: Player) => bestPassOption,
    hasBall: (player: Player) => false,
    receivedWaitMessage: (player: Player) => false,
    isNearestTeamMateToBall: (player: Player) => false,
    shotValue: (player: Player) => 0,
    teamInControl: (player: Player) => false,
  } as IPlayerStateFeatureExtractor;
};
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
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'hasBall').returns(true);
      const state = new PassingState(commandFactory, extractor);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.PASS_BALL)
        .returns(command);

      state.update(player);
      expect(command.execute).to.have.been.calledWith(player, bestPassOption);
    });

    it('does nothing if the player does not have the ball', () => {
      const extractor = getNewExtractor();
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
