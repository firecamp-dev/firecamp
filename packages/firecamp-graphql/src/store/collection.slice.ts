import { Rest } from '@firecamp/cloud-apis';
import {
  IRequestFolder,
  IGraphQLPlayground,
  TId,
  ERequestTypes,
} from '@firecamp/types';

interface ICollection {
  isProgressing?: boolean;
  tdpInstance?: any;
  items?: Array<Partial<IGraphQLPlayground & { _meta: { is_item?: boolean } }>>;
  folders?: Array<Partial<IRequestFolder & { _meta: { is_folder?: boolean } }>>;
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

const createCollectionSlice = (
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
  },

  toggleProgressBar: (flag?: boolean) => {
    set((s) => ({
      isProgressing: typeof flag == 'boolean' ? flag : !s.isProgressing,
    }));
  },

  deleteItem: async (id: TId) => {
    const state = get();
    // console.log(state)
    if (!state.request?._meta.id) return;
    state.toggleProgressBar(true);
    const res = await Rest.request
      .deleteItem(state.request._meta.id, id)
      .then((r) => {
        set((s) => {
          const items = s.collection.items.filter((i) => i._meta.id != id);
          s.collection.tdpInstance?.deleteItem(id);
          return {
            collection: { ...s.collection, items },
            ui: { ...s.ui, playgrounds: items?.length },
          };
        });
        // return r;
      })
      .then((r) => {
        state.context.appService.notify.success(
          'The playground has been deleted successfully'
        );
      })
      .catch((e) => {
        console.log(e);
        if (e.message == 'Network Error') {
          //TODO: show error notification
        }
        state.context.appService.notify.alert(
          e.response?.data.message || e.message
        );
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
    if (!state.request?._meta.id) return;
    const plg = state.playgrounds[state.runtime.activePlayground];

    const item = {
      name,
      body: plg.request.body,
      meta: plg.request.meta,
      _meta: {
        request_id: state.request._meta.id,
        request_type: ERequestTypes.GraphQL,
        collectionId: state.request._meta.collectionId,
      },
    };

    state.toggleProgressBar(true);
    const res = await Rest.request
      .createItem(state.request._meta.id, item)
      .then((r) => {
        const playgroundId = r.data._meta.id;
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
        get().context.appService.notify.success(
          'The playground has been saved successfully'
        );
      })
      .catch((e) => {
        console.log(e);
        if (e.message == 'Network Error') {
          //TODO: show error notification
        }
        get().context.appService.notify.alert(
          e.response?.data.message || e.message
        );
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },

  updateItem: async (updateOnlyName?: boolean) => {
    const state = get();
    if (!state.request?._meta.id) return;
    const playgroundId = state.runtime.activePlayground;
    const plg = state.playgrounds[playgroundId];

    const item = {
      _meta: {
        id: plg.request._meta.id,
        request_id: state.request._meta.id,
        collectionId: state.request._meta.collectionId,
      },
    };
    if (updateOnlyName) {
      //@ts-ignore
      item.name = plg.request.name;
    } else {
      //@ts-ignore
      item.body = plg.request.body;
      //@ts-ignore
      item.meta = plg.request.meta;
    }

    state.toggleProgressBar(true);
    const res = await Rest.request
      .updateItem(item._meta.request_id, item._meta.id, item)
      .then((r) => {
        set((s) => {
          const items = s.collection.items.map((i) => {
            if (i._meta.id == r.data._meta.id) return { ...i, ...r.data };
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
        state.context.appService.notify.success(
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
        state.context.appService.notify.alert(
          e.response?.data.message || e.message
        );
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
