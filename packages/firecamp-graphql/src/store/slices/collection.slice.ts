import { Rest } from '@firecamp/cloud-apis';
import {
  IRequestFolder,
  IGraphQLPlayground,
  TId,
  ERequestTypes,
} from '@firecamp/types';
import { TStoreSlice } from '../store.type';

interface ICollection {
  isProgressing?: boolean;
  tdpInstance?: any;
  items?: Partial<IGraphQLPlayground & { __ref: { isItem?: boolean } }>[];
  folders?: Partial<IRequestFolder & { __ref: { isFolder?: boolean } }>[];
}

interface ICollectionSlice {
  collection: ICollection;

  toggleProgressBar: (flag?: boolean) => void;
  registerTDP: (instance: any) => void;
  unRegisterTDP: () => void;

  initialiseCollection: (collection: ICollection) => void;

  /** delete playground */
  deleteItem: (id: TId) => Promise<any>;

  /** add/save playground */
  addItem: (name: string) => Promise<any>;

  /** update playground */
  updateItem: (updateOnlyName?: boolean) => Promise<any>;
}

const createCollectionSlice: TStoreSlice<ICollectionSlice> = (
  set,
  get,
  initialCollection?: ICollection
): ICollectionSlice => ({
  collection: initialCollection || {
    isProgressing: false,
    tdpInstance: null,
    items: [],
    folders: [],
  },

  // register TreeDatProvider instance
  registerTDP: (instance: any) => {
    set((s) => ({ collection: { ...s.collection, tdpInstance: instance } }));
  },

  // unregister TreeDatProvider instance
  unRegisterTDP: () => {
    set((s) => ({ collection: { ...s.collection, tdpInstance: null } }));
  },

  // collection
  initialiseCollection: (collection: ICollection) => {
    console.log(collection?.items?.length, 'collection?.items?.length...');
    const state = get();
    set((s) => ({
      collection: {
        ...s.collection,
        ...collection,
      },
      ui: {
        ...s.ui,
        playgrounds: collection?.items?.length,
      },
    }));
    state.collection.tdpInstance?.init(
      collection.folders || [],
      collection.items || []
    );
  },

  toggleProgressBar: (flag?: boolean) => {
    set((s) => ({
      collection: {
        ...s.collection,
        isProgressing:
          typeof flag == 'boolean' ? flag : !s.collection.isProgressing,
      },
    }));
  },

  deleteItem: async (id: TId) => {
    const state = get();
    // console.log(state)
    if (!state.request?.__ref.id) return;
    state.toggleProgressBar(true);
    const res = await Rest.request
      .deleteItem(state.request.__ref.id, id)
      .then((r) => {
        set((s) => {
          const items = s.collection.items.filter((i) => i.__ref.id != id);
          s.collection.tdpInstance?.deleteItem(id);
          return {
            collection: { ...s.collection, items },
            ui: { ...s.ui, playgrounds: items?.length },
          };
        });
        // return r;
      })
      .then((r) => {
        state.context.app.notify.success(
          'The playground has been deleted successfully'
        );
      })
      .catch((e) => {
        console.log(e);
        if (e.message == 'Network Error') {
          //TODO: show error notification
        }
        state.context.app.notify.alert(e.response?.data.message || e.message);
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },

  addItem: async (name: string) => {
    const state = get();
    // console.log(state)
    if (!name) return;
    if (!state.request?.__ref.id) return;
    const plg = state.playgrounds[state.runtime.activePlayground];

    const item = {
      name,
      payload: plg.request.body,
      __meta: plg.request.__meta,
      __ref: {
        requestId: state.request.__ref.id,
        requestType: ERequestTypes.GraphQL,
        collectionId: state.request.__ref.collectionId,
      },
    };

    state.toggleProgressBar(true);
    const res = await Rest.request
      .createItem(state.request.__ref.id, item)
      .then((r) => {
        const playgroundId = r.data.__ref.id;
        set((s) => {
          console.log(r.data);
          const items = [...s.collection.items, r.data];
          s.collection.tdpInstance?.addItem(r.data);
          return {
            collection: { ...s.collection, items },
            ui: { ...s.ui, playgrounds: items?.length },
            playgrounds: {
              ...s.playgrounds,
              [playgroundId]: {
                ...s.playgrounds[playgroundId],
                request: r.data,
                lastRequest: null,
              },
            },
            runtime: {
              ...s.runtime,
              activePlayground: playgroundId,
              playgroundTabs: s.runtime.playgroundTabs.map((t) =>
                t.id == s.runtime.activePlayground
                  ? { id: playgroundId, name: r.data.name }
                  : t
              ),
              playgroundsMeta: {
                ...s.runtime.playgroundsMeta,
                [playgroundId]: {
                  ...s.runtime.playgroundsMeta[playgroundId],
                  isSaved: true,
                },
              },
            },
          };
        });
        // return r;
      })
      .then((r) => {
        state.context.app.notify.success(
          'The playground has been saved successfully'
        );
      })
      .catch((e) => {
        console.log(e);
        if (e.message == 'Network Error') {
          //TODO: show error notification
        }
        state.context.app.notify.alert(e.response?.data.message || e.message);
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },

  updateItem: async (updateOnlyName?: boolean) => {
    const state = get();
    if (!state.request?.__ref.id) return;
    const playgroundId = state.runtime.activePlayground;
    const plg = state.playgrounds[playgroundId];

    const item = {
      __ref: {
        id: plg.request.__ref.id,
        requestId: state.request.__ref.id,
        collectionId: state.request.__ref.collectionId,
      },
    };
    if (updateOnlyName) {
      //@ts-ignore
      item.name = plg.request.name;
    } else {
      //@ts-ignore
      item.body = plg.request.body;
      //@ts-ignore
      item.__meta = plg.request.__meta;
    }

    state.toggleProgressBar(true);
    const res = await Rest.request
      .updateItem(item.__ref.requestId, item.__ref.id, item)
      .then((r) => {
        set((s) => {
          const items = s.collection.items.map((i) => {
            if (i.__ref.id == r.data.__ref.id) return { ...i, ...r.data };
            return i;
          });
          s.collection.tdpInstance?.updateItem(r.data);
          return {
            collection: { ...s.collection, items },
            playgrounds: {
              ...s.playgrounds,
              [playgroundId]: {
                ...s.playgrounds[playgroundId],
                lastRequest: null,
              },
            },
            runtime: {
              ...s.runtime,
              playgroundsMeta: {
                ...s.runtime.playgroundsMeta,
                [playgroundId]: {
                  ...s.runtime.playgroundsMeta[playgroundId],
                  hasChange: false,
                },
              },
            },
          };
        });
        return r;
      })
      .then((r) => {
        state.context.app.notify.success(
          updateOnlyName
            ? 'The playground name has been changed successfully'
            : 'The playground has been updated successfully'
        );
      })
      .catch((e) => {
        console.log(e);
        if (e.message == 'Network Error') {
          //TODO: show error notification
        }
        state.context.app.notify.alert(e.response?.data.message || e.message);
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
