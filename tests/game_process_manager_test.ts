import { GameRoom } from '../src/game_room';
import { GameProcessManager } from '../src/game_process_manager';
import { IO_MESSAGE_TYPE } from '../src/constants';
import { TestGameClient } from './helpers/test_game_client';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

class TestProcess implements IProcess {
  public send(message: any) {
    return;
  }
}

class TestProcessForker implements IProcessForker {
  public fork(executabelFile: string) {
    return new TestProcess();
  }
}

describe('GameProcessManager', () => {
  describe('`start`', () => {
    it('forks a new process', () => {
    });
  });
});
