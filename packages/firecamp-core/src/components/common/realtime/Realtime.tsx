import { FC, useEffect } from 'react';
import { Realtime } from '@firecamp/cloud-apis';
import { prepareEventNameForRequestPull } from '../../../types';
import { platformEmitter } from '../../../services/platform-emitter';

const RealtimeEventManager: FC<any> = () => {
  
	/** handle realtime request changes */
	useEffect(() => {
		const onRequestChange = (payload) => {
			console.log({ onRequestChanges: payload });
			platformEmitter.emit(
				prepareEventNameForRequestPull(payload.request_id),
				payload.actions
			);
		};

    platformEmitter.on('socket.connected', () => {
			console.log('socket.connected - 1');
      Realtime.socket.onRequestChanges(onRequestChange);
    });

    return () => {
			platformEmitter.on('socket.connected', onRequestChange);
			// TODO: unsubscribe explorer changes on unmount
		};
  }, []);

	/** handle realtime explorer changes */
	useEffect(() => {
		const onExplorerItemInsert = ({ type, payload})=> {};
		const onExplorerItemUpdate = ({ type, payload})=> {};
		const onExplorerItemDelete = ({ type, payload})=> {};

		const onExplorerChanges = () => {
      console.log('socket.connected - 2');
      Realtime.socket.onExplorerItemInsert(onExplorerItemInsert);
			Realtime.socket.onExplorerItemUpdate(onExplorerItemUpdate);
			Realtime.socket.onExplorerItemDelete(onExplorerItemDelete);
    }

    platformEmitter.on('socket.connected', onExplorerChanges);

    return () => {
			platformEmitter.on('socket.connected', onExplorerChanges);

			// TODO: unsubscribe explorer changes on unmount
		};
  }, []);


  return <></>;
};

export default RealtimeEventManager;
