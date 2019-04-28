import { CommandFactory } from '../../../../src/commands/command_factory';
import { COMMANDS, STATE_MACHINE_COMMANDS } from '../../../../src/constants';
import { IPlayerStateFeature } from '../../../../src/interfaces/iplayer_state_feature';
import { WaitingState } from '../../../../src/game_ai/player/state_machine/waiting_state';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';

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

describe('WaitingState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a stop command if eligilble', () => {
        const state = new WaitingState(commandFactory);
        const features = getNewFeatures();
        features.hasWaitMessages = true;
        features.hasBall = false;
        features.teamInControl = true;

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMANDS.STOP)
          .returns(command);

        state.update(player, features);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('tells the player to stop waiting if the player has the ball',
        () => {
          const state = new WaitingState(commandFactory);
          const features = getNewFeatures();
          features.hasWaitMessages = true;
          features.hasBall = true;
          features.teamInControl = true;

          const sendMessageStub = sinon.stub(player, 'sendMessage');

          state.update(player, features);
          expect(sendMessageStub).to.have.been.calledWith(
            player, {details: STATE_MACHINE_COMMANDS.NO_NEED_TO_WAIT});
    });

    it('tells the player to stop waiting if its team looses control',
        () => {
          const state = new WaitingState(commandFactory);
          const features = getNewFeatures();
          features.hasWaitMessages = true;
          features.hasBall = false;
          features.teamInControl = false;

          const sendMessageStub = sinon.stub(player, 'sendMessage');

          state.update(player, features);
          expect(sendMessageStub).to.have.been.calledWith(
            player, {details: STATE_MACHINE_COMMANDS.NO_NEED_TO_WAIT});
    });

    it('does not call a command if the player\'s team looses control', () => {
      const state = new WaitingState(commandFactory);
      const features = getNewFeatures();
      features.hasWaitMessages = true;
      features.hasBall = false;
      features.teamInControl = false;

      // silence errors related to a null messaeQueue
      sinon.stub(player, 'sendMessage');

      const getCommandStub = sinon.stub(commandFactory, 'getCommand')
      state.update(player, features);

      expect(getCommandStub).not.to.have.been.called;
    });

    it('does not call a command if the player has the ball', () => {
      const state = new WaitingState(commandFactory);
      const features = getNewFeatures();
      features.hasWaitMessages = true;
      features.hasBall = true;
      features.teamInControl = false;

      // silence errors related to a null messaeQueue
      sinon.stub(player, 'sendMessage');

      const getCommandStub = sinon.stub(commandFactory, 'getCommand')
      state.update(player, features);

      expect(getCommandStub).not.to.have.been.called;
    });

    it('does nothing if the player does not have wait messages', () => {
      const state = new WaitingState(commandFactory);
      const features = getNewFeatures();
      features.hasWaitMessages = false;

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.STOP)
        .returns(command);

      state.update(player, features);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
