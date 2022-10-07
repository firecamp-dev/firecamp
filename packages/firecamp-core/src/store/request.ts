import { Rest } from '@firecamp/cloud-apis';
import { EHttpMethod, EPushActionType, TId } from '@firecamp/types';
import create from 'zustand';
import AppService from '../services/app';

import * as platformContext from '../services/platform-context';
import { useTabStore } from './tab';
import { useWorkspaceStore } from './workspace';

export interface IRequestStore {
  requestBeingSaved: any;
  requestTabId: TId;

  setReqAndTabId: (request: any, tabId: TId) => void;
  onSaveRequest: (request?: {
    name: string;
    description?: string;
    collection_id: TId;
    folder_id?: TId;
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
    collection_id: TId;
    folder_id?: TId;
  }) => {
    try {
      //   console.log({ requestToSave: request });

      const state = get();

      let requestTabId = state.requestTabId,
        requestBeingSaved = state.requestBeingSaved;

      /**
       * Check if request is inserted or not
       * If yes, update tab name, type, and subType by saved request
       * Else, update tab meta
       */

      console.log({ requestBeingSaved, request });

      if (request && requestBeingSaved) {
        if (!request.name || !request.collection_id) return;

        // prepare request payload
        requestBeingSaved = {
          ...requestBeingSaved,
          meta: {
            ...requestBeingSaved['meta'],
            name: request.name,
            description: request.description || '',
          },
          _meta: {
            ...requestBeingSaved['_meta'],
            collection_id: request.collection_id,
            folder_id: request.folder_id,
          },
          _action: {
            ...requestBeingSaved['_action'],
            collection_id: request.collection_id,
          },
        };
      }

      const requestPushPayload =
        await platformContext.request.normalizePushPayload(requestBeingSaved);

      const { onNewRequestCreate } = useWorkspaceStore.getState();
      // TODO: handle error here
      const response = await Rest.request.push([requestPushPayload]);
      // reflect in explorer
      onNewRequestCreate(requestBeingSaved);

      // console.log({ requestBeingSaved });

      const tabState = useTabStore.getState();
      if (
        requestBeingSaved &&
        requestBeingSaved._action.type === EPushActionType.Insert
      ) {
        tabState.update.rootKeys(requestTabId, {
          name: requestBeingSaved?.meta?.name || 'Untitled request',
          type: requestBeingSaved?.meta?.type || '',
          // subType: requestBeingSaved?.meta?.data_type || '',
          request: {
            url: requestBeingSaved.url,
            method: requestBeingSaved.method || EHttpMethod.POST,
            meta: requestBeingSaved.meta,
            _meta: requestBeingSaved._meta,
          },
          meta: {
            isSaved: true,
            hasChange: false,
            isFresh: false,
            isDeleted: false,
            revision: 1,
          },
        });
      } else {
        // update tab meta on save request
        tabState.update.meta(requestTabId, {
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
