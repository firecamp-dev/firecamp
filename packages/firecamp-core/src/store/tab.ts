import create from 'zustand';
import _reject from 'lodash/reject';
import { nanoid } from 'nanoid';
import { TId } from '@firecamp/types';
import { _object } from '@firecamp/utils';

import { ITab, ITabMeta } from '../components/tabs/types';

const initialState = {
  list: [],
  activeTab: 'home',
  orders: [],
};

interface ITabStore {
  list: ITab[];
  activeTab: string;
  orders: string[];

  reorder: (dragIndex: number, hoverIndex: number) => void;
  remove: (tbId: string) => void;
  update: {
    meta: (tab, meta, request?: any) => void; //todo: define types...
    activeTab: (tabId: string) => void;
    rootKeys: (tabId: TId, updatedTab: Partial<ITab>) => void;
  };
  open: {
    new: (type: string, isActive: boolean, subType: string) => void;
    request: (
      request: any,
      options: {
        setActive?: boolean;
        isSaved?: boolean;
        isHistoryTab?: boolean;
        _meta?: any;
      }
    ) => void;
    saved: (request: any) => void;
  };
  close: {
    all: () => void;
    active: (tabId?: string) => void;
    byIds: (ids: string[]) => void;
    allLeft: (id?: string) => void;
    allRight: (id?: string) => void;
    allExceptActive: () => void;
    allSaved: () => void;
    allFresh: () => void;
    allDirty: () => void;
  };

  // common
  dispose: () => void;
}

const useTabStore = create<ITabStore>((set, get) => {
  return {
    ...initialState,

    reorder: async (dragIndex, hoverIndex) => {
      set((s) => {
        let orders = [...s.orders];
        let dragTab = s.orders[dragIndex];
        if (
          dragIndex === undefined ||
          hoverIndex === undefined ||
          !orders.length ||
          !dragTab
        )
          return s;

        //Get sorted Tabs
        orders.splice(dragIndex, 1);
        orders.splice(hoverIndex, 0, dragTab);

        return {
          orders,
          activeTab: dragTab,
        };
      });
    },

    remove: (tabId) => {
      set((s) => {
        // s.update.meta(tabId, { isClosed: true });
        let index = s.list.findIndex((t) => t.id == tabId);
        if (index == -1) return s;

        let activeTab =
          tabId == s.activeTab
            ? index == 0
              ? 'home'
              : s.list[index - 1].id
            : s.activeTab;

        /*To remove tab from cacheTabs*/
        // cacheTabsFactoryFns.removeTab(tabId)
        let list = [..._reject(s.list, (t) => t.id == tabId)];

        return {
          list,
          activeTab,
          orders: list.map((t) => t.id),
        };
      });
    },

    update: {
      meta: (tabId: TId, meta: ITabMeta) => {
        set((s) => {
          let tabs = s.list.map((t) => {
            if (t.id !== tabId) return t;
            // console.log({ meta, tabId });

            return {
              ...t,
              meta: { ...t.meta, ...meta },
              // request: request || t.request,
            };
          });
          return { list: [...tabs] };
        });
      },

      activeTab: (tabId) => {
        set((s) => ({ activeTab: tabId }));
        // tab.storeCacheTabsInDBWithDebounce();
      },

      rootKeys: (tabId: TId, updatedTab: Partial<ITab>) => {
        set((s) => {
          let tabs = s.list.map((t) => {
            if (t.id !== tabId) return t;
            // console.log({ meta, tabId });

            return {
              ...t,
              ...updatedTab,
            };
          });
          return { list: [...tabs] };
        });
      },
    },

    open: {
      new: (type: string, isActive: boolean, subType: string = '') => {
        let tab: ITab = {
          id: nanoid(),
          name: 'New Tab',
          type,
          subType,
          meta: {
            isSaved: false,
            hasChange: false,
            isFresh: true,
            isDeleted: false,
            revision: 1,
          },
        };

        /*To add tab in cacheTabs*/
        // cacheTabsFactoryFns.setTab(tab.id, cacheTabPayload)
        let state = get();
        let list = [...state.list, tab];

        set((s) => {
          return {
            list,
            activeTab: isActive == true ? tab.id : s.activeTab,
            orders: list.map((t) => t.id),
          };
        });
      },

      request: (
        request,
        { setActive = false, isSaved = true, isHistoryTab = false, _meta = {} }
      ) => {
        let { list, activeTab } = get();
        let tab = {
          id: nanoid(),
          name: request?.meta?.name || 'untitled request',
          type: request.meta.type,
          subType: request.meta ? request.meta.data_type : '',
          request,
          meta: {
            isSaved: isSaved,
            hasChange: false,
            isFresh: true,
            revision: 1,
            isDeleted: false,
            isHistoryTab,
            _meta,
          },
        };

        /*To add tab in cacheTabs*/
        // cacheTabsFactoryFns.setTab(tab.id, cacheTabPayload)

        set((s: any) => {
          return {
            list: [...list, tab],
            activeTab: setActive == true ? tab.id : activeTab,
            orders: list.map((t) => t.id),
          };
        });
      },

      saved: async ({ name, url, method, meta, _meta }) => {
        // Todo: need to improve this old structure
        // note: above request is coming from explorer/tree item

        let request = {
          url,
          method,
          meta,
          _meta,
        };

        let { list, update, open } = get();
        let tabAlreadyExists = list.find(
          (l) => l?.request?._meta?.id == request?._meta?.id
        );

        // console.log(tabAlreadyExists);

        if (tabAlreadyExists) {
          update.activeTab(tabAlreadyExists.id);
          return;
        }

        // console.log('in store...', request);

        return open.request(request, {
          setActive: true,
          _meta: request._meta,
          isSaved: true,
        });
      },
    },

    close: {
      all: () => {
        // cacheTabsFactoryFns.closeAllTabs();
        set((s) => ({
          list: [],
          activeTab: 'home',
          orders: [],
        }));
      },

      active: async (tabId) => {
        let state = get();
        state.remove(tabId || state.activeTab);
      },

      byIds: (ids = []) => {
        if (!ids || (ids && !Array.isArray(ids))) return;

        try {
          ids.map((id) => {
            get().close.active(id);
          });
        } catch (e) {
          console.log(`close call tabs error:`, e);
        }
      },

      allLeft: async (id = '') => {
        let { list, activeTab, close } = get();
        let tabsToClose = [];

        let tabIndex = -1;

        if (id?.length) {
          tabIndex = list.findIndex((tab) => tab.id === id);
        } else {
          tabIndex = list.findIndex((tab) => tab.id === activeTab);
        }
        if (tabIndex > 0) {
          tabsToClose = list.slice(0, tabIndex);
        }

        if (tabsToClose) {
          console.log(`Close left: tabsToClose`, tabsToClose);
          let ids = tabsToClose.map((tab) => tab.id);
          close.byIds(ids);
        }
      },

      allRight: async (id = '') => {
        let { list, activeTab, close } = get();
        let tabsToClose = [];

        let tabIndex = -1;

        if (activeTab === 'home') {
          close.all();
          return;
        }

        if (id?.length) {
          tabIndex = list.findIndex((tab) => tab.id === id);
        } else {
          tabIndex = list.findIndex((tab) => tab.id === activeTab);
        }
        if (tabIndex > list.length && tabIndex !== -1) {
          tabsToClose = list.slice(tabIndex + 1);
        }

        if (tabsToClose) {
          console.log(`Close right: tabsToClose`, tabsToClose);

          let ids = tabsToClose.map((tab) => tab.id);
          close.byIds(ids);
        }
      },

      allExceptActive: async () => {
        let { list, activeTab, close } = get();
        let tabsToClose = [];

        if (activeTab === 'home') {
          close.all();
          return;
        }
        let tabIndex = list.findIndex((tab) => tab.id === activeTab);
        if (tabIndex <= list.length && tabIndex !== -1) {
          tabsToClose = [
            ...list.slice(0, tabIndex),
            ...list.slice(tabIndex + 1),
          ];
        }

        if (tabsToClose) {
          console.log(`Close except active: tabsToClose`, tabsToClose);
          let ids = tabsToClose.map((tab) => tab.id);
          close.byIds(ids);
        }
      },

      allSaved: async () => {
        let { list, activeTab, close } = get();

        let tabsToClose = list.filter(
          (tab) => tab?.meta?.isSaved === true && tab.meta?.hasChange !== true
        );
        // console.log({ list, tabsToClose });

        if (tabsToClose) {
          // console.log(`Close saved: tabsToClose`, tabsToClose);
          let ids = tabsToClose.map((tab) => tab.id);
          close.byIds(ids);
        }
      },

      allFresh: async () => {
        let { list, close } = get();
        let tabsToClose = list.filter(
          (tab) =>
            tab.meta &&
            tab.meta.isSaved === false &&
            tab.meta.isFresh === true &&
            tab.meta.hasChange === false
        );
        if (tabsToClose) {
          console.log(`Close saved: tabsToClose`, tabsToClose);
          let ids = tabsToClose.map((tab) => tab.id);
          close.byIds(ids);
        }
      },

      allDirty: async () => {
        let { list, close } = get();
        let tabsToClose = list.filter(
          (tab) =>
            tab.meta && tab.meta.isSaved === true && tab.meta.hasChange === true
        );
        if (tabsToClose) {
          console.log(`Close saved: tabsToClose`, tabsToClose);
          let ids = tabsToClose.map((tab) => tab.id);
          close.byIds(ids);
        }
      },
    },

    // dispose whole store and reset to initial state
    dispose: () => set({ ...initialState }),
  };
});
export { ITabStore, useTabStore };
