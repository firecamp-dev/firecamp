import { FC, useEffect } from 'react';
import { Realtime } from '@firecamp/cloud-apis';
import { ERequestTypes, TId } from '@firecamp/types';
import { platformEmitter as emitter } from '../../../services/platform-emitter';
import { useWorkspaceStore } from '../../../store/workspace';
import {
  EPlatformTabs,
  prepareEventNameForRequestPull,
} from '../../../services/platform-emitter/events';
import { useTabStore } from '../../../store/tab';
import PreComp from '../../tabs/header/PreComp';

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
  } = useWorkspaceStore.getState();

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
    const onExplorerItemInsert = ({ type, payload }) => {
      console.log(type, payload);
      switch (type) {
        case 'collection':
          onCreateCollection(payload);
          break;
        case 'folder':
          onCreateFolder(payload);
          break;
        case 'request':
          onCreateRequest(payload);
          break;
      }
    };
    const onExplorerItemUpdate = ({ type, payload }) => {
      console.log(type, payload);
      switch (type) {
        case 'collection':
          onUpdateCollection(payload);
          break;
        case 'folder':
          onUpdateFolder(payload);
          break;
        case 'request':
          onUpdateRequest(payload);
          break;
      }
    };
    const onExplorerItemDelete = ({ type, payload }) => {
      console.log(type, payload);
      switch (type) {
        case 'collection':
          onDeleteCollection(payload);
          break;
        case 'folder':
          onDeleteFolder(payload);
          break;
        case 'request':
          onDeleteRequest(payload);
          break;
      }
    };

    const listenExplorerChanges = () => {
      console.log('socket:connected');
      Realtime.listenExplorerItemInsert(onExplorerItemInsert);
      Realtime.listenExplorerItemUpdate(onExplorerItemUpdate);
      Realtime.listenExplorerItemDelete(onExplorerItemDelete);
    };

    const listenOffExplorerChanges = () => {
      console.log('socket:disconnected');
      Realtime.listenOffExplorerItemInsert();
      Realtime.listenOffExplorerItemUpdate();
      Realtime.listenOffExplorerItemDelete();
    };

    emitter.on('socket.connected', listenExplorerChanges);
    emitter.on('socket.disconnected', listenOffExplorerChanges);

    return () => {
      emitter.off('socket.connected');
      // TODO: unsubscribe explorer changes on unmount server socket
    };
  }, []);

  // handle platform events
  useEffect(() => {
    emitter.on(
      EPlatformTabs.Open,
      (
        { entity, __meta } = {
          entity: { __meta: { type: ERequestTypes.Rest } },
          __meta: { id: '', type: 'request' },
        }
      ) => {
        // console.log(entity, __meta, 55555);
        const [tab, orders] = open(entity, __meta);
        // console.log(tab, 'opened tab');
        if (!tab) return; // if request is already opened then retun value would be [ null, null]

        emitter.emit(EPlatformTabs.Opened, [
          {
            ...tab,
            preComp: <PreComp entityType={__meta.type} entity={entity} />,
            dotIndicator: tab.__meta?.hasChange === true,
          },
          orders,
        ]);
      }
    );

    emitter.on(EPlatformTabs.Close, (tabId_s: TId | TId[]) => {
      close.byIds(Array.isArray(tabId_s) ? tabId_s : [tabId_s]);
      emitter.emit(EPlatformTabs.Closed, tabId_s);
    });

    return () => {
      emitter.off(EPlatformTabs.Open);
      emitter.off(EPlatformTabs.Close);
    };
  }, []);

  return <></>;
};

export default RealtimeEventManager;
