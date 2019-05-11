import { GameRoom } from '../src/game_room';
import { IO_MESSAGE_TYPE } from '../src/constants';
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
      const client = new TestGameClient();
      const room = new GameRoom();
      room.addClient(client);

      expect(room.getClients()).to.eql([client]);
    });

    it('adds the client to the room', () => {
      const client = new TestGameClient();
      const room = new GameRoom();
      room.addClient(client);

      expect(client.getRoom()).to.eql(room);
    });
  });

  describe('`publish`', () => {
    it('sends a message to all its clients', () => {
      const clientOne = new TestGameClient();
      const clientTwo = new TestGameClient();
      const room = new GameRoom();

      [clientOne, clientTwo].forEach((client) => {
        room.addClient(client);
        sinon.stub(client, 'send');
      });

      room.publish(IO_MESSAGE_TYPE.PING, 'HI');

      [clientOne, clientTwo].forEach((client) => {
        expect(client.send).to.have.been.calledWith(IO_MESSAGE_TYPE.PING, 'HI');
      });
    });

    it('does not send a message to clients outside the room', () => {
      const client = new TestGameClient();
      const room = new GameRoom();
      sinon.stub(client, 'send');

      room.publish(IO_MESSAGE_TYPE.PING, 'HI');
      expect(client.send).not.to.have.been.called;
    });
  });
});
