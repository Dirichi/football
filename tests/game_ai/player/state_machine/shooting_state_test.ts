import { CommandFactory } from '../../../../src/commands/command_factory';
import { ShootingState } from '../../../../src/game_ai/player/state_machine/shooting_state';
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
    bestPassingOption: new Player(0, 0, 0, 0, 5),
    hasBall: false,
    hasOpenPassingOptions: false,
    hasWaitMessages: false,
    isNearestTeamMateToBall: false,
    shotValue: 0,
    teamInControl: false,
  } as IPlayerStateFeature;
};
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
        const state = new ShootingState(commandFactory);
        const features = getNewFeatures();
        features.hasBall = true;
        features.hasOpenPassingOptions = false;

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMANDS.SHOOT_BALL)
          .returns(command);

        state.update(player, features);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('does nothing if the player does not have the ball', () => {
      const state = new ShootingState(commandFactory);
      const features = getNewFeatures();
      features.hasBall = false;
      features.hasOpenPassingOptions = false;

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.SHOOT_BALL)
        .returns(command);

      state.update(player, features);
      expect(command.execute).not.to.have.been.called;
    });

    it('does nothing if the player is not in a good shooting position', () => {
      const state = new ShootingState(commandFactory);
      const features = getNewFeatures();
      features.hasBall = true;
      features.hasOpenPassingOptions = true;

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.SHOOT_BALL)
        .returns(command);

      state.update(player, features);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
