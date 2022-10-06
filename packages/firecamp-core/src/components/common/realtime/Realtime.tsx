import { FC, useEffect } from 'react';
import { Realtime } from '@firecamp/cloud-apis';
import { prepareEventNameForRequestPull } from '../../../types';
import { platformEmitter } from '../../../services/platform-emitter';
import { IWorkspaceStore, useWorkspaceStore } from '../../../store/workspace'

const RealtimeEventManager: FC<any> = () => {

	const { 
		onCreateCollection,
		onUpdateCollection,
		onDeleteCollection,
		onCreateFolder,
		onUpdateFolder,
		onDeleteFolder,
	} = useWorkspaceStore.getState();

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
	  switch(type) {
		case "collection": 
			onCreateCollection(payload);
		break;
		case "folder": 
			onCreateFolder(payload);
		break;
		case "request": 
			// onCreateRequest(payload);
		break;
	  }
    };
    const onExplorerItemUpdate = ({ type, payload }) => {
      console.log(type, payload);
	  switch(type) {
		case "collection": 
			onUpdateCollection(payload);
		break;
		case "folder": 
			onUpdateFolder(payload);
		break;
		case "request": 
			// onUpdateRequest(payload);
		break;
	  }
    };
    const onExplorerItemDelete = ({ type, payload }) => {
      console.log(type, payload);
	  switch(type) {
		case "collection": 
			onDeleteCollection(payload);
		break;
		case "folder": 
			onDeleteFolder(payload);
		break;
		case "request": 
			// onDeleteRequest(payload);
		break;
	  }
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
