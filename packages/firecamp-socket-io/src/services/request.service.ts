import { ERequestTypes, ISocketIOConnection, ISocketIO } from '@firecamp/types';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { nanoid as id } from 'nanoid';
import { _object, _array, _string } from '@firecamp/utils';
import {
  RequestConnection,
  DefaultRequestConfig,
} from '../constants';

// import { IUiRequestPanel } from '../store/slices';

// export const prepareUIRequestPanelState = (
//   request: Partial<IWebSocket>
// ): IUiRequestPanel => {
//   const updatedUiStore: IUiRequestPanel = {};
//   return updatedUiStore;
// };

/** normalize the socket.io request */
export const normalizeRequest = (request: ISocketIO): Promise<ISocketIO> => {
  const _nr: ISocketIO = {
    url: { raw: '' },
    __meta: {
      name: '',
      type: ERequestTypes.SocketIO,
      version: '2.0.0',
    },
    __ref: { id: '', collectionId: '' },
  };

  const { __meta, __ref, url, connections, config } = request;

  // console.log({ request });

  //normalize url
  _nr.url = !_object.isEmpty(url) ? url : { raw: '' };

  // normalize __meta
  _nr.__meta.name = __meta.name || 'Untitled Request';
  _nr.__meta.description = __meta.description || '';
  _nr.__meta.fOrders = __meta.fOrders || [];
  _nr.__meta.iOrders = __meta.iOrders || [];
  _nr.__meta.type = ERequestTypes.SocketIO;
  _nr.__meta.version = '2.0.0';

  // normalize __ref
  _nr.__ref.id = __ref?.id || id();
  _nr.__ref.collectionId = __ref?.collectionId;
  _nr.__ref.folderId = __ref?.folderId;
  _nr.__ref.createdAt = __ref?.createdAt || new Date().valueOf();
  _nr.__ref.updatedAt = __ref?.updatedAt || new Date().valueOf();
  _nr.__ref.createdBy = __ref?.createdBy || '';
  _nr.__ref.updatedBy = __ref?.updatedBy || '';

  // normalize _meta
  _nr.connections = [];
  _nr.connections = connections.map(
    (connection: ISocketIOConnection) =>
      _object.mergeDeep(RequestConnection, connection) as ISocketIOConnection
  );
  if (!_nr.connections?.length) _nr.connections = [RequestConnection];

  console.log(connections, _nr.connections, 789789);

  // normalize config
  _nr.config = _object.mergeDeep(DefaultRequestConfig, config || {});
  return Promise.resolve(_nr);
};
