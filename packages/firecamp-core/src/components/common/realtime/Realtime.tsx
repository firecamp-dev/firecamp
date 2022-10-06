import { FC, useEffect } from 'react';
import { Realtime } from '@firecamp/cloud-apis';
import { prepareEventNameForRequestPull } from '../../../types';
import { platformEmitter } from '../../../services/platform-emitter';

const RealtimeEventManager: FC<any> = () => {

  /** handle realtime request changes */
  useEffect(() => {
    const onRequestChange = () => {
      Realtime.onRequestChanges((payload) => {
        console.log({ onRequestChanges: payload });
        platformEmitter.emit(
          prepareEventNameForRequestPull(payload.request_id),
          payload.actions
        );
      });
    };

    platformEmitter.on('socket.connected', onRequestChange);
    return () => {
      platformEmitter.off('socket.connected', onRequestChange);
    };
  }, []);

  /** handle realtime explorer changes */
  useEffect(() => {
    const onExplorerItemInsert = ({ type, payload }) => {
		console.log(type, payload);
	};
    const onExplorerItemUpdate = ({ type, payload }) => {
		console.log(type, payload);
	};
    const onExplorerItemDelete = ({ type, payload }) => {
		console.log(type, payload);
	};

    const onExplorerChanges = () => {
      console.log('socket.connected - 2');
      Realtime.onExplorerItemInsert(onExplorerItemInsert);
      Realtime.onExplorerItemUpdate(onExplorerItemUpdate);
      Realtime.onExplorerItemDelete(onExplorerItemDelete);
    };

    platformEmitter.on('socket.connected', onExplorerChanges);

    return () => {
      platformEmitter.off('socket.connected', onExplorerChanges);
      // TODO: unsubscribe explorer changes on unmount server socket
    };
  }, []);

  return <></>;
};

export default RealtimeEventManager;
