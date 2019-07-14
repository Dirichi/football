import { CommandFactory } from '../../../../src/commands/command_factory';
import { DefensiveRunState } from '../../../../src/game_ai/player/state_machine/defensive_run_state';
import { IPlayerStateFeatureExtractor } from '../../../../src/interfaces/iplayer_state_feature_extractor';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMAND_ID } from '../../../../src/constants';
import { Vector3D } from '../../../../src/three_dimensional_vector';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let commandFactory: CommandFactory;
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
        const extractor = getNewExtractor();
        sinon.stub(extractor, 'teamInControl').returns(false);
        sinon.stub(extractor, 'isNearestTeamMateToBall').returns(false);
        const state = new DefensiveRunState(commandFactory, extractor);

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMAND_ID.MOVE_TO_DEFENSIVE_POSITION)
          .returns(command);

        state.update(player);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('does nothing if the team has the ball', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'teamInControl').returns(true);
      sinon.stub(extractor, 'isNearestTeamMateToBall').returns(false);
      const state = new DefensiveRunState(commandFactory, extractor);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.MOVE_TO_DEFENSIVE_POSITION)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });

    it('does nothing if the player is the nearest to the ball', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'teamInControl').returns(false);
      sinon.stub(extractor, 'isNearestTeamMateToBall').returns(true);
      const state = new DefensiveRunState(commandFactory, extractor);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.MOVE_TO_DEFENSIVE_POSITION)
        .returns(command);

      state.update(player);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
