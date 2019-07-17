import { CommandFactory } from '../../../../src/commands/command_factory';
import { COMMAND_ID, STATE_MACHINE_COMMANDS } from '../../../../src/constants';
import { IPlayerStateFeatureExtractor } from '../../../../src/interfaces/iplayer_state_feature_extractor';
import { WaitingState } from '../../../../src/game_ai/player/state_machine/waiting_state';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
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
    expectedPassInterceptedOrCompleted: (player: Player) => false,
  } as IPlayerStateFeatureExtractor;
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
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'receivedWaitMessage').returns(true);
      sinon.stub(extractor, 'expectedPassInterceptedOrCompleted').returns(false);
      const state = new WaitingState(commandFactory, extractor);

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMAND_ID.STOP)
        .returns(command);

      state.update(player);

      expect(command.execute).to.have.been.calledWith(player);
    });

    it('does not call a command if the the expected pass was intercepted',
      () => {
        const extractor = getNewExtractor();
        sinon.stub(extractor, 'receivedWaitMessage').returns(true);
        sinon.stub(extractor, 'expectedPassInterceptedOrCompleted').returns(true);
        const state = new WaitingState(commandFactory, extractor);

        const getCommandStub = sinon.stub(commandFactory, 'getCommand');
        state.update(player);

        expect(getCommandStub).not.to.have.been.called;
    });

    it('clears wait messages if the the expected pass was intercepted', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'receivedWaitMessage').returns(true);
      sinon.stub(extractor, 'expectedPassInterceptedOrCompleted').returns(true);
      const state = new WaitingState(commandFactory, extractor);
      sinon.spy(player, 'clearMessagesByTitle');

      state.update(player);

      expect(player.clearMessagesByTitle).to.have.been.calledWith(
        STATE_MACHINE_COMMANDS.WAIT);
    });

    it('does nothing if the player does not have wait messages', () => {
      const extractor = getNewExtractor();
      sinon.stub(extractor, 'receivedWaitMessage').returns(false);
      const state = new WaitingState(commandFactory, extractor);

      sinon.stub(commandFactory, 'getCommand');
      state.update(player);

      expect(commandFactory.getCommand).not.to.have.been.called;
    });
  });
});
