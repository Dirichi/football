import { CommandFactory } from '../../../../src/commands/command_factory';
import { DribblingState } from '../../../../src/game_ai/player/state_machine/dribbling_state';
import { Player } from '../../../../src/game_objects/player';
import { IPlayerStateFeature } from '../../../../src/interfaces/iplayer_state_feature';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let commandFactory: CommandFactory;
let getNewFeatures = () => {
  return {
    hasBall: false,
    hasGoodPassingOptions: false,
    hasWaitMessages: false,
    isNearestTeamMateToBall: false,
    isInGoodShootingPosition: false,
    teamInControl: false,
  } as IPlayerStateFeature;
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
    it('executes a dribble command if eligilble', () => {
        const state = new DribblingState(commandFactory);
        const features = getNewFeatures();
        features.hasBall = true;

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMANDS.DRIBBLE)
          .returns(command);

        state.update(player, features);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('does nothing if the player does not have the ball', () => {
      const state = new DribblingState(commandFactory);
      const features = getNewFeatures();
      features.hasBall = false;

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.DRIBBLE)
        .returns(command);

      state.update(player, features);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
