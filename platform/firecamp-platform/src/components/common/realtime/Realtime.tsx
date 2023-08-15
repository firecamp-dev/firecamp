import { FC, useEffect } from 'react';
import { Realtime } from '@firecamp/cloud-apis';
import { TId } from '@firecamp/types';
import {
  EWorkspaceEventTypes,
  TWorkspaceEvent,
} from '@firecamp/cloud-apis/dist/realtime';
import { platformEmitter as emitter } from '../../../services/platform-emitter';
import {
  EPlatformTabs,
  prepareEventNameForRequestPull,
} from '../../../services/platform-emitter/events';
import { useTabStore } from '../../../store/tab';
import { useExplorerStore } from '../../../store/explorer';

const RealtimeEventManager: FC<any> = () => {
  const { open, close } = useTabStore.getState();

  const {
    onCreateCollection,
    onUpdateCollection,
    onDeleteCollection,
    onCreateFolder,
    onUpdateFolder,
    onDeleteFolder,
    onCreateRequest,
    onUpdateRequest,
    onDeleteRequest,
  } = useExplorerStore.getState();

  /** handle realtime request changes */
  useEffect(() => {
    const onRequestChange = () => {
      Realtime.onRequestChanges((payload) => {
        console.log({ onRequestChanges: payload });
        emitter.emit(
          prepareEventNameForRequestPull(payload.requestId),
          payload.actions
        );
      });
    };
    emitter.on('socket.connected', onRequestChange);
    return () => {
      emitter.off('socket.connected', onRequestChange);
    };
  }, []);

  /** handle realtime explorer changes */
  useEffect(() => {
    const onWorkspaceChanges = (event: TWorkspaceEvent) => {
      const { type, value } = event;
      console.log(type, value, 7777777);
      switch (type) {
        case EWorkspaceEventTypes.CollectionCreated:
          onCreateCollection(value);
          break;
        case EWorkspaceEventTypes.CollectionUpdated:
          onUpdateCollection(value);
          break;
        case EWorkspaceEventTypes.CollectionDeleted:
          onDeleteCollection(value);
          break;

        case EWorkspaceEventTypes.FolderCreated:
          onCreateFolder(value);
          break;
        case EWorkspaceEventTypes.FolderUpdated:
          onUpdateFolder(value);
          break;
        case EWorkspaceEventTypes.FolderDeleted:
          onDeleteFolder(value);
          break;

        case EWorkspaceEventTypes.RequestCreated:
          onCreateRequest(value);
          break;
        case EWorkspaceEventTypes.RequestUpdated:
          onUpdateRequest(value);
          break;
        case EWorkspaceEventTypes.RequestDeleted:
          onDeleteRequest(value);
          break;
      }
    };

    const listenToWorkspaceChanges = () => {
      console.log('socket:connected');
      Realtime.listenToWorkspaceChanges(onWorkspaceChanges);
    };

    const listenOffWorkspaceChanges = () => {
      console.log('socket:disconnected');
      Realtime.listenOffWorkspaceChanges();
    };

    emitter.on('socket.connected', listenToWorkspaceChanges);
    emitter.on('socket.disconnected', listenOffWorkspaceChanges);

    return () => {
      emitter.off('socket.connected');
      // TODO: unsubscribe explorer changes on unmount server socket
    };
  }, []);

  // handle platform events
  useEffect(() => {
    emitter.on(EPlatformTabs.Close, (tabId_s: TId | TId[]) => {
      close.byIds(Array.isArray(tabId_s) ? tabId_s : [tabId_s]);
      emitter.emit(EPlatformTabs.Closed, tabId_s);
    });
    return () => {
      emitter.off(EPlatformTabs.Close);
    };
  }, []);

  return <></>;
};

export default RealtimeEventManager;
