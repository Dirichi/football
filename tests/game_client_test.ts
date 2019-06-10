import { GameClient } from '../src/game_client';
import { IO_MESSAGE_TYPE } from '../src/constants';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { TestWebSocket } from './helpers/test_websocket';

const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('GameClient', () => {
  describe('`configure`', () => {
    it('stores the user\'s preferred role type', () => {
      const socket = new TestWebSocket();
      const client = new GameClient(socket);

      client.configure();
      socket.emit(IO_MESSAGE_TYPE.PREFFERD_ROLE_TYPE, {
        role: PLAYER_ROLE_TYPE.KEEPER,
      });

      expect(client.getPreferredRoleType()).equals(PLAYER_ROLE_TYPE.KEEPER);
    });
  });
})
