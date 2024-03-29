import _WebSocket from 'ws';
import { nanoid } from 'nanoid';
import Executor from '../';
import { EMessageBodyType, ERequestTypes } from '@firecamp/types';
import { localServerRequest, secureServerRequest } from './__mocks__';
import { IExecutor } from '../executor.interface';
import { ILog, ELogTypes } from '../types';

let executor1: IExecutor;
let executor2: IExecutor;

beforeAll(() => {
  executor1 = new Executor({
    url: localServerRequest.url,
    WebSocket: _WebSocket,
    certificates: [],
    config: localServerRequest.config,
    connection: localServerRequest.connection,
  });

  executor2 = new Executor({
    url: secureServerRequest.url,
    WebSocket: _WebSocket,
    certificates: [],
    config: secureServerRequest.config,
    connection: secureServerRequest.connection,
  });
});

describe('Connection', () => {
  it('should connect to the server', (done) => {
    executor1.connect();

    executor1.onOpen(() => done());
  }, 60000);

  it('should connect to the secure server', (done) => {
    executor2.connect();

    executor2.onOpen(() => done());
  }, 60000);
});

describe.skip('Message passing', () => {
  it('should pass the message via connection', (done) => {
    executor1.logs((log: ILog) => {
      if (log.__meta.type === ELogTypes.Send) {
        expect(log.value.value).toEqual('hi');
        done();
      }
    });

    executor1.send({
      name: '',
      value: 'hi',
      __meta: { type: EMessageBodyType.Text },
      __ref: {
        id: nanoid(),
        collectionId: nanoid(),
        requestType: ERequestTypes.WebSocket,
        requestId: localServerRequest.__ref.id,
      },
    });
  }, 60000);
});

describe('should disconnect client', () => {
  it('should disconnect server client', (done) => {
    executor1.onClose(() => done());

    executor1.disconnect();
  });

  it('should disconnect secure server client', (done) => {
    executor2.onClose(() => done());

    executor2.disconnect();
  });
});
