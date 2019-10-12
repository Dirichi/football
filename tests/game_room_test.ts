import { GameRoom } from '../src/game_room';
import { PROCESS_MESSAGE_TYPE, COMMAND_ID } from '../src/constants';
import { TestProcess } from './helpers/test_process';
import { TestModelStore } from './helpers/test_model_store';
import { TestProcessForker } from './helpers/test_process_forker';
import { TestGameClient } from './helpers/test_game_client';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { IGameSessionAttributes } from '../src/interfaces/igame_session_attributes';

import sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

let room: GameRoom;

describe('GameRoom', () => {
  beforeEach(() => {
    const gameSession = {id: 1, gameRoomId: '1'};
    const storeRecords = new Map([[1, gameSession]]);
    const store = new TestModelStore<IGameSessionAttributes>(storeRecords);
    room = new GameRoom(gameSession.gameRoomId);
    room.setGameSessionStore(store);
    room.setProcessForker(new TestProcessForker());
    room.setGameExecutablePath('fake/game/path');
    room.setStartGameTimeout(0);
  });

  describe('`.find`', () => {
    it('returns a GameRoom with a matching id', () => {
      room.save();
      const roomRecord = GameRoom.find(room.getId());
      expect(roomRecord).to.equal(room);
    });

    it('returns null if no such room is saved', () => {
      room.save();
      const nonexistentRoomId = room.getId() + '1';
      const roomRecord = GameRoom.find(nonexistentRoomId);
      expect(roomRecord).to.be.null;
    });
  });

  describe('`.deleteAll`', () => {
    it('empties GameRoom records', () => {
      room.save();
      GameRoom.deleteAll();
      const roomRecord = GameRoom.find(room.getId());

      expect(roomRecord).to.be.null;
    });
  });

  describe('`addClient`', () => {
    it('adds the client to the room', async () => {
      const client = new TestGameClient('1');
      await room.addClient(client);

      expect(room.getClients()).to.eql([client]);
    });

    it('passes command requests from game clients to the gameProcess',
      async () => {
        const client = new TestGameClient('1');
        const forker = new TestProcessForker();
        const testProcess = new TestProcess();

        sinon.stub(forker, 'fork').returns(testProcess);
        room.addClient(client);
        room.setGameExecutablePath('fake/executable/path.js');
        room.setProcessForker(forker);

        await room.startGame();
        sinon.spy(testProcess, 'send');
        client.simulateCommandRequest({commandId: COMMAND_ID.STOP});
        expect(testProcess.send).to.have.been.calledWith({
          data: { clientId: '1', commandId: COMMAND_ID.STOP },
          messageType: PROCESS_MESSAGE_TYPE.COMMAND,
        });
    });

    it('starts a timeout to begin the game when the first client joins',
      (done) => {
        const clock = sinon.useFakeTimers();
        const client = new TestGameClient('1');
        room.setStartGameTimeout(100);
        room.addClient(client).then((_) => {
          expect(room.getGameProcess()).to.not.be.null;
          done();
        });

        clock.tick(200);
    });

    it('does not start a timeout to begin the game when other clients join' +
      ' after the first', (done) => {
        const clock = sinon.useFakeTimers();
        const forker = new TestProcessForker();
        room.setProcessForker(forker);
        room.setStartGameTimeout(5000);
        sinon.spy(forker, 'fork');

        room.addClient(new TestGameClient('1')).then((_) => {
          room.addClient(new TestGameClient('2')).then((_) => {
            expect(forker.fork).to.have.been.calledOnce;
            done();
          });
        });

        clock.tick(5001);
        clock.tick(5001);
    });
  });

  describe('`startGame`', () => {
    it('forks a new game process', async () => {
      const forker = new TestProcessForker();
      const testProcess = new TestProcess();

      room.setProcessForker(forker);
      room.setGameExecutablePath('fake/executable/path.js');
      sinon.stub(forker, 'fork')
        .withArgs('fake/executable/path.js')
        .returns(testProcess);

      await room.startGame();
      expect(room.getGameProcess()).to.equal(testProcess);
    });

    it('marks the gameSession as started', async () => {
      const store: TestModelStore<IGameSessionAttributes> =
        new TestModelStore();
      const session = await store.create({gameRoomId: '1'});
      const room = new GameRoom(session.gameRoomId);
      room.setGameSessionStore(store);
      room.setProcessForker(new TestProcessForker());
      const now = 1000000;
      sinon.useFakeTimers(now);

      await room.startGame();

      const updatedSession = await store.find(session.id);
      expect(updatedSession.startedAt).to.eql(new Date(now));
    });

    it('does not fork multiple processes', async () => {
      const forker = new TestProcessForker();

      room.setProcessForker(forker);
      sinon.spy(forker, 'fork');

      for(let i = 0; i < 3; i ++) await room.startGame();
      expect(forker.fork).to.have.been.calledOnce;
    });

    it('broadcasts game state from the gameProcess to clients', async () => {
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

      await room.startGame();
      testProcess.sendMessageToMainProcess({
        messageType: PROCESS_MESSAGE_TYPE.GAME_STATE,
        data: { alive: true },
      });

      clients.forEach((client) => {
        expect(client.updateGameState).to.have.been.calledWith({ alive: true });
      });
    });

    it('kills the gameProcess when the game is over', async () => {
      const forker = new TestProcessForker();
      const testProcess = new TestProcess();

      sinon.stub(forker, 'fork')
        .withArgs('fake/executable/path.js')
        .returns(testProcess);

      room.setProcessForker(forker);
      room.setGameExecutablePath('fake/executable/path.js');

      await room.startGame();
      sinon.stub(testProcess, 'termintate');
      testProcess.sendMessageToMainProcess({
        messageType: PROCESS_MESSAGE_TYPE.GAME_OVER,
        data: {},
      });

      expect(testProcess.termintate).to.have.been.called;
    });
  });
});
