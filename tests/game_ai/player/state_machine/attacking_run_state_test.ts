import { CommandFactory } from '../../../../src/commands/command_factory';
import { AttackingRunState } from '../../../../src/game_ai/player/state_machine/attacking_run_state';
import { IPlayerStateFeature } from '../../../../src/interfaces/iplayer_state_feature';
import { Player } from '../../../../src/game_objects/player';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { COMMANDS } from '../../../../src/constants';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let commandFactory: CommandFactory;
let player: Player;
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

describe('AttackingRunState', () => {
  beforeEach(() => {
    player = new Player(0, 0, 0, 0, 5);
    commandFactory = new CommandFactory(new Map());
  });

  afterEach(() => {
    player = null;
    commandFactory = null;
  });

  describe('`update`', () => {
    it('executes a moveTowardsAttackingPosition command if eligilble', () => {
        const state = new AttackingRunState(commandFactory);
        const features = getNewFeatures();
        features.teamInControl = true;
        features.hasBall = false;

        const command = { execute: sinon.spy() };
        sinon.stub(commandFactory, 'getCommand')
          .withArgs(COMMANDS.MOVE_TO_ATTACKING_POSITION)
          .returns(command);

        state.update(player, features);
        expect(command.execute).to.have.been.calledWith(player);
    });

    it('does nothing if the team does not have the ball', () => {
      const state = new AttackingRunState(commandFactory);

      const features = getNewFeatures();
      features.teamInControl = false;
      features.hasBall = false;

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.MOVE_TO_ATTACKING_POSITION)
        .returns(command);

      state.update(player, features);
      expect(command.execute).not.to.have.been.called;
    });

    it('does nothing if the player is with the ball', () => {
      const state = new AttackingRunState(commandFactory);

      const features = getNewFeatures();
      features.teamInControl = true;
      features.hasBall = true;

      const command = { execute: sinon.spy() };
      sinon.stub(commandFactory, 'getCommand')
        .withArgs(COMMANDS.MOVE_TO_ATTACKING_POSITION)
        .returns(command);

      state.update(player, features);
      expect(command.execute).not.to.have.been.called;
    });
  });
});
