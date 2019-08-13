import { GameRoom } from '../src/game_room';
import { IO_MESSAGE_TYPE, PROCESS_MESSAGE_TYPE, COMMAND_ID } from '../src/constants';
import { TestProcess } from './helpers/test_process';
import { TestProcessForker } from './helpers/test_process_forker';
import { TestGameClient } from './helpers/test_game_client';
import * as chai from 'chai';
import * as sinon from 'sinon';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('GameRoom', () => {
  describe('`.find`', () => {
    it('returns a GameRoom with a matching id', () => {
      const room = new GameRoom();
      room.save();
      const roomRecord = GameRoom.find(room.getId());
      expect(roomRecord).to.equal(room);
    });

    it('returns null if no such room is saved', () => {
      const room = new GameRoom();
      room.save();
      const nonexistentRoomId = room.getId() + '1';
      const roomRecord = GameRoom.find(nonexistentRoomId);
      expect(roomRecord).to.be.null;
    });
  });

  describe('`.deleteAll`', () => {
    it('empties GameRoom records', () => {
      const room = new GameRoom();
      room.save();
      GameRoom.deleteAll();
      const roomRecord = GameRoom.find(room.getId());

      expect(roomRecord).to.be.null;
    });
  });

  describe('`addClient`', () => {
    it('adds the client to the room', () => {
      const client = new TestGameClient('1');
      const room = new GameRoom();
      // Prevent setTimeout calls;
      sinon.useFakeTimers();
      room.addClient(client);

      expect(room.getClients()).to.eql([client]);
    });

    it('passes command requests from game clients to the gameProcess', () => {
      const client = new TestGameClient('1');
      const room = new GameRoom();
      const forker = new TestProcessForker();
      const testProcess = new TestProcess();

      // Prevent setTimeout calls;
      sinon.useFakeTimers();
      sinon.stub(forker, 'fork').returns(testProcess);
      room.addClient(client);
      room.setGameExecutablePath('fake/executable/path.js');
      room.setProcessForker(forker);

      room.startGame();
      sinon.spy(testProcess, 'send');
      client.simulateCommandRequest({commandId: COMMAND_ID.STOP});
      expect(testProcess.send).to.have.been.calledWith({
        data: { clientId: '1', commandId: COMMAND_ID.STOP },
        messageType: PROCESS_MESSAGE_TYPE.COMMAND,
      });
    });

    it('starts a timeout to begin the game when the first client joins', () => {
      const clock = sinon.useFakeTimers();
      const client = new TestGameClient('1');
      const room = new GameRoom();
      const forker = new TestProcessForker();
      room.setProcessForker(forker);
      room.setGameExecutablePath('fake/executable/path.js');
      room.setStartGameTimeout(5000);
      sinon.spy(forker, 'fork');

      room.addClient(client);
      clock.tick(5001);
      expect(forker.fork).to.have.been.called;
    });

    it('does not start a timeout to begin the game when other clients join' +
      ' after the first', () => {
        const clock = sinon.useFakeTimers();
        const room = new GameRoom();
        const forker = new TestProcessForker();
        room.setProcessForker(forker);
        room.setGameExecutablePath('fake/executable/path.js');
        room.setStartGameTimeout(5000);
        sinon.spy(forker, 'fork');

        room.addClient(new TestGameClient('1'));
        clock.tick(5001);
        room.addClient(new TestGameClient('2'));
        clock.tick(5001);

        expect(forker.fork).to.have.been.calledOnce;
    });
  });

  describe('`startGame`', () => {
    it('forks a new game process', () => {
      const room = new GameRoom();
      const forker = new TestProcessForker();
      const testProcess = new TestProcess();

      room.setProcessForker(forker);
      room.setGameExecutablePath('fake/executable/path.js');
      sinon.stub(forker, 'fork')
        .withArgs('fake/executable/path.js')
        .returns(testProcess);

      room.startGame();
      expect(room.getGameProcess()).to.equal(testProcess);
    });

    it('does not fork multiple processes', () => {
      const room = new GameRoom();
      const forker = new TestProcessForker();

      room.setProcessForker(forker);
      room.setGameExecutablePath('fake/executable/path.js');
      sinon.spy(forker, 'fork');

      for(let i = 0; i < 3; i ++) room.startGame();
      expect(forker.fork).to.have.been.calledOnce;
    });

    it('broadcasts game state from the gameProcess to clients', () => {
      const room = new GameRoom();
      const forker = new TestProcessForker();
      const testProcess = new TestProcess();
      const clients = ['1', '2'].map((id) => new TestGameClient(id));

      sinon.stub(forker, 'fork')
        .withArgs('fake/executable/path.js')
        .returns(testProcess);

      clients.forEach((client) => room.addClient(client));
      room.setProcessForker(forker);
      room.setGameExecutablePath('fake/executable/path.js');

      clients.forEach((client) => sinon.stub(client, 'updateGameState'));

      room.startGame();
      testProcess.sendMessageToMainProcess({
        messageType: PROCESS_MESSAGE_TYPE.GAME_STATE,
        data: { alive: true },
      });

      clients.forEach((client) => {
        expect(client.updateGameState).to.have.been.calledWith({ alive: true });
      });
    });

    it('kills the gameProcess when the game is over', () => {
      const room = new GameRoom();
      const forker = new TestProcessForker();
      const testProcess = new TestProcess();

      sinon.stub(forker, 'fork')
        .withArgs('fake/executable/path.js')
        .returns(testProcess);

      room.setProcessForker(forker);
      room.setGameExecutablePath('fake/executable/path.js');

      room.startGame();
      sinon.stub(testProcess, 'termintate');
      testProcess.sendMessageToMainProcess({
        messageType: PROCESS_MESSAGE_TYPE.GAME_OVER,
        data: {},
      });

      expect(testProcess.termintate).to.have.been.called;
    });
  });
});
