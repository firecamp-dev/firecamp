import create from 'zustand';
import _reject from 'lodash/reject';
import { nanoid } from 'nanoid';
import { ERequestTypes, TId } from '@firecamp/types';
import { _object } from '@firecamp/utils';
import { dissoc } from 'ramda';

import { IRequestTab } from '../components/tabs/types';
import { platformEmitter } from '../services/platform-emitter';
import { EPlatformTabs } from '../services/platform-emitter/events';

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
  changeMeta: (tab, __meta, request?: any) => void; //todo: define types...
  changeActiveTab: (tabId: string) => void;
  changeRootKeys: (tabId: TId, updatedTab: Partial<IRequestTab>) => void;
  changeOrders: (orders: TId[]) => void;
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
        __ref?: any;
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
        // s.changeMeta(tabId, { isClosed: true });
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

    changeMeta: (tabId: TId, __meta: IRequestTab['__meta']) => {
      const state = get();
      const tab = state.list[tabId];
      if (!tab?.__meta) return;
      // console.log(s.list, tabId, __meta, 9999);
      set((s) => {
        const list = {
          ...s.list,
          [tabId]: {
            ...tab,
            __meta: {
              ...tab.__meta,
              ...__meta,
            },
          },
        };
        return { list };
      });
      // if __meta.hasChange will change then emit EPlatformTabs.changeState
      if (tab.__meta.hasChange === false && __meta.hasChange === true) {
        platformEmitter.emit(EPlatformTabs.changeState, [tabId, 'modified']);
      } else if (tab.__meta.hasChange === true && __meta.hasChange === false) {
        platformEmitter.emit(EPlatformTabs.changeState, [tabId, 'default']);
      }
    },

    changeActiveTab: (tabId) => {
      set((s) => ({ activeTab: tabId }));
      // tab.storeCacheTabsInDBWithDebounce();
    },

    changeRootKeys: (tabId: TId, updatedTab: Partial<IRequestTab>) => {
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

    changeOrders: (orders) => {
      set((s) => ({
        orders,
      }));
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
          __meta: {
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
        { setActive = false, isSaved = true, isHistoryTab = false, __ref = {} }
      ) => {
        const { list, orders, activeTab } = get();
        const tId = nanoid();
        const tab: IRequestTab = {
          id: tId,
          name: request?.__meta?.name || 'untitled request',
          type: request.__meta.type,
          request,
          __meta: {
            isSaved: isSaved,
            hasChange: false,
            isFresh: true,
            revision: 1,
            isDeleted: false,
            isHistoryTab,
            // _meta,
          },
        };

        /*To add tab in cacheTabs*/
        // cacheTabsFactoryFns.setTab(tab.id, cacheTabPayload)

        const _orders = [...orders, tId];
        set((s: ITabStore) => {
          return {
            list: { ...list, [tId]: tab },
            activeTab: setActive == true ? tab.id : activeTab,
            orders: _orders,
          };
        });

        return [tab, _orders];
      },

      saved: ({ name, url, method, __meta, __ref }) => {
        // Todo: need to improve this old structure
        // note: above request is coming from explorer/tree item

        let request = {
          url,
          method,
          __meta,
          __ref,
        };

        let { list, changeActiveTab, open } = get();
        let tabAlreadyExists = Object.values(list).find(
          (l) => l?.request?.__ref?.id == request?.__ref?.id
        );

        // console.log(tabAlreadyExists);

        if (tabAlreadyExists) {
          changeActiveTab(tabAlreadyExists.id);
          return null;
        }

        // console.log('in store...', request);

        return open.request(request, {
          setActive: true,
          __ref: request.__ref,
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
          (tab) =>
            tab?.__meta?.isSaved === true && tab.__meta?.hasChange !== true
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
            tab.__meta &&
            tab.__meta.isSaved === false &&
            tab.__meta.isFresh === true &&
            tab.__meta.hasChange === false
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
            tab.__meta &&
            tab.__meta.isSaved === true &&
            tab.__meta.hasChange === true
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
