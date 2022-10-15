import create from 'zustand';
import _reject from 'lodash/reject';
import { nanoid } from 'nanoid';
import { ERequestTypes, TId } from '@firecamp/types';
import { _object } from '@firecamp/utils';
import { dissoc } from 'ramda';

import { IRequestTab } from '../components/tabs/types';

const initialState = {
  list: {},
  activeTab: 'home',
  orders: [],
};

interface ITabStore {
  list: Record<TId, IRequestTab>;
  activeTab: TId;
  orders: TId[];

  reorder: (dragIndex: number, hoverIndex: number) => void;
  remove: (tbId: string) => void;
  update: {
    meta: (tab, meta, request?: any) => void; //todo: define types...
    activeTab: (tabId: string) => void;
    rootKeys: (tabId: TId, updatedTab: Partial<IRequestTab>) => void;
  };
  open: {
    new: (
      type?: string,
      isActive?: boolean
    ) => [tab: IRequestTab, orders: TId[]];
    request: (
      request: any,
      options: {
        setActive?: boolean;
        isSaved?: boolean;
        isHistoryTab?: boolean;
        _meta?: any;
      }
    ) => [tab: IRequestTab, orders: TId[]];
    saved: (request: any) => [tab: IRequestTab, orders: TId[]];
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
        const index = s.orders.findIndex((t) => t == tabId);
        if (index == -1) return s;

        const activeTab =
          tabId == s.activeTab
            ? index == 0
              ? 'home'
              : s.orders[index - 1]
            : s.activeTab;

        /*To remove tab from cacheTabs*/
        // cacheTabsFactoryFns.removeTab(tabId)
        const list = dissoc(tabId, s.list);

        return {
          list,
          activeTab,
          orders: s.orders.filter((id) => id != tabId),
        };
      });
    },

    update: {
      meta: (tabId: TId, meta: IRequestTab['meta']) => {
        set((s) => {
          const tab = s.list[tabId];
          const list = {
            ...s.list,
            [tabId]: {
              ...tab,
              meta: {
                ...tab.meta,
                ...meta,
              },
            },
          };
          return { list };
        });
      },

      activeTab: (tabId) => {
        set((s) => ({ activeTab: tabId }));
        // tab.storeCacheTabsInDBWithDebounce();
      },

      rootKeys: (tabId: TId, updatedTab: Partial<IRequestTab>) => {
        set((s) => {
          const list = {
            ...s.list,
            [tabId]: {
              ...s.list[tabId],
              ...updatedTab,
            },
          };
          return { list };
        });
      },
    },

    open: {
      new: (type, isActive) => {
        const { list, orders, activeTab } = get();
        const tId = nanoid();
        if (!type) {
          if (orders.length === 0) type = ERequestTypes.Rest;
          else {
            let tab;
            if (activeTab === 'home') {
              tab = list[orders[orders.length - 1]];
            } else {
              tab = list[activeTab];
            }
            type = tab?.type;
          }
        }
        const tab: IRequestTab = {
          id: tId,
          name: 'New Tab',
          type: type || ERequestTypes.Rest,
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
        const _list = { ...list, [tId]: tab };

        const _orders = [...orders, tId];
        set((s) => ({
          list: _list,
          activeTab: isActive == true ? tab.id : s.activeTab,
          orders: _orders,
        }));
        return [tab, _orders];
      },

      request: (
        request,
        { setActive = false, isSaved = true, isHistoryTab = false, _meta = {} }
      ) => {
        let { list, orders, activeTab } = get();
        const tId = nanoid();
        let tab = {
          id: tId,
          name: request?.meta?.name || 'untitled request',
          type: request.meta.type,
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

        const _orders = [...orders, tId];
        set((s: any) => {
          return {
            list: { ...list, [tId]: tab },
            activeTab: setActive == true ? tab.id : activeTab,
            orders: _orders,
          };
        });

        return [tab, _orders];
      },

      saved: ({ name, url, method, meta, _meta }) => {
        // Todo: need to improve this old structure
        // note: above request is coming from explorer/tree item

        let request = {
          url,
          method,
          meta,
          _meta,
        };

        let { list, update, open } = get();
        let tabAlreadyExists = Object.values(list).find(
          (l) => l?.request?._meta?.id == request?._meta?.id
        );

        // console.log(tabAlreadyExists);

        if (tabAlreadyExists) {
          update.activeTab(tabAlreadyExists.id);
          return null;
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
          list: {},
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

      allLeft: async (tabId: TId) => {
        let { orders, activeTab, close } = get();
        let tabsToClose = [];

        let tabIndex = -1;

        if (tabId) {
          tabIndex = orders.findIndex((id) => tabId === id);
        } else {
          tabIndex = orders.findIndex((id) => id === activeTab);
        }
        if (tabIndex > 0) {
          tabsToClose = orders.slice(0, tabIndex);
        }

        if (tabsToClose) {
          console.log(`Close left: tabsToClose`, tabsToClose);
          close.byIds(tabsToClose);
        }
      },

      allRight: async (tabId: TId) => {
        let { orders, activeTab, close } = get();
        let tabsToClose = [];

        let tabIndex = -1;

        if (activeTab === 'home') {
          close.all();
          return;
        }

        if (tabId) {
          tabIndex = orders.findIndex((id) => tabId === id);
        } else {
          tabIndex = orders.findIndex((id) => id === activeTab);
        }
        if (tabIndex > orders.length && tabIndex !== -1) {
          tabsToClose = orders.slice(tabIndex + 1);
        }

        if (tabsToClose) {
          console.log(`Close right: tabsToClose`, tabsToClose);
          close.byIds(tabsToClose);
        }
      },

      allExceptActive: async () => {
        let { orders, activeTab, close } = get();
        let tabsToClose = [];

        if (activeTab === 'home') {
          close.all();
          return;
        }
        let tabIndex = orders.findIndex((id) => id === activeTab);
        if (tabIndex <= orders.length && tabIndex !== -1) {
          tabsToClose = [
            ...orders.slice(0, tabIndex),
            ...orders.slice(tabIndex + 1),
          ];
        }

        if (tabsToClose) {
          console.log(`Close except active: tabsToClose`, tabsToClose);
          close.byIds(tabsToClose);
        }
      },

      allSaved: async () => {
        let { list, close } = get();

        let tabsToClose = Object.values(list).filter(
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
        let tabsToClose = Object.values(list).filter(
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
        let tabsToClose = Object.values(list).filter(
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
