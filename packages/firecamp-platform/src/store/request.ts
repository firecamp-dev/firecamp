import { Rest } from '@firecamp/cloud-apis';
import { EHttpMethod, TId } from '@firecamp/types';
import create from 'zustand';
import AppService from '../services/app';

import pltContext from '../services/platform-context';
import { useTabStore } from './tab';
import { useWorkspaceStore } from './workspace';

export interface IRequestStore {
  requestBeingSaved: any;
  requestTabId: TId;

  setReqAndTabId: (request: any, tabId: TId) => void;
  onSaveRequest: (request?: {
    name: string;
    description?: string;
    collectionId: TId;
    folderId?: TId;
  }) => void;
}

export const useRequestStore = create<IRequestStore>((set, get) => ({
  requestTabId: '',
  requestBeingSaved: {},

  setReqAndTabId: (request: any, tabId: TId) => {
    set({ requestBeingSaved: request, requestTabId: tabId });
  },
  onSaveRequest: async (request?: {
    name: string;
    description?: string;
    collectionId: TId;
    folderId?: TId;
  }) => {
    try {
      //   console.log({ requestToSave: request });
      const state = get();

      let requestTabId = state.requestTabId,
        requestBeingSaved = state.requestBeingSaved;

      /**
       * Check if request is inserted or not
       * If yes, update tab name, type, and subType by saved request
       * Else, update tab __meta
       */

      console.log({ requestBeingSaved, request });

      if (request && requestBeingSaved) {
        if (!request.name || !request.collectionId) return;

        // prepare request payload
        requestBeingSaved = {
          ...requestBeingSaved,
          __meta: {
            ...requestBeingSaved['__meta'],
            name: request.name,
            description: request.description || '',
          },
          __ref: {
            ...requestBeingSaved['__ref'],
            collectionId: request.collectionId,
            folderId: request.folderId,
          },
          _action: {
            ...requestBeingSaved['_action'],
            collectionId: request.collectionId,
          },
        };
      }

      const requestPushPayload =
        await pltContext.request.normalizePushPayload(requestBeingSaved);

      const { onNewRequestCreate } = useWorkspaceStore.getState();
      // TODO: handle error here
      const response = await Rest.request.push([requestPushPayload]);
      // reflect in explorer
      onNewRequestCreate(requestBeingSaved);

      // console.log({ requestBeingSaved });

      const tabState = useTabStore.getState();
      if (
        requestBeingSaved &&
        requestBeingSaved._action.type === 'i'
      ) {
        tabState.changeRootKeys(requestTabId, {
          name: requestBeingSaved?.__meta?.name,
          type: requestBeingSaved?.__meta?.type || '',
          // subType: requestBeingSaved?.__meta?.data_type || '',
          request: {
            url: requestBeingSaved.url,
            method: requestBeingSaved.method || EHttpMethod.POST,
            __meta: requestBeingSaved.__meta,
            __ref: requestBeingSaved.__ref,
          },
          __meta: {
            isSaved: true,
            hasChange: false,
            isFresh: false,
            isDeleted: false,
            revision: 1,
          },
        });
      } else {
        // update tab meta on save request
        tabState.changeMeta(requestTabId, {
          isSaved: true,
          hasChange: false,
          isFresh: false,
        });
      }

      set({ requestBeingSaved: {}, requestTabId: '' });

      AppService.modals.close();
    } catch (error) {
      console.error({
        error,
        API: 'store.request.onSaveRequest',
      });
    }
  },
}));
