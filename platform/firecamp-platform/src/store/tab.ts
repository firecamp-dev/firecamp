import create from 'zustand';
import _reject from 'lodash/reject';
import { nanoid } from 'nanoid';
import { ERequestTypes, TId } from '@firecamp/types';
import { _object } from '@firecamp/utils';
import { IEntityTab } from '../components/tabs/types';
import { platformEmitter } from '../services/platform-emitter';
import { EPlatformTabs } from '../services/platform-emitter/events';
import platformContext from '../services/platform-context';

const initialState = {
  list: {},
  activeTab: 'home',
  orders: [],
};

interface ITabStore {
  list: Record<TId, IEntityTab>;
  activeTab: TId;
  orders: TId[];

  getActiveTab: () => TId;
  getTab: (id: TId) => IEntityTab;
  reorder: (dragIndex: number, hoverIndex: number) => void;
  remove: (tbId: string) => void;
  changeMeta: (tab, __meta, request?: any) => void; //todo: define types...
  changeActiveTab: (tabId: string) => void;
  changeRootKeys: (tabId: TId, updatedTab: Partial<IEntityTab>) => void;
  changeOrders: (orders: TId[]) => void;
  open: (
    entity: any,
    entityMeta: { id: TId; type: 'request' | 'environment' }
  ) => [tab: IEntityTab, orders: TId[]];
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

    getActiveTab: () => {
      return get().activeTab;
    },
    getTab: (tabId) => {
      return get().list[tabId];
    },
    reorder: async (dragIndex, hoverIndex) => {
      set((s) => {
        const orders = [...s.orders];
        const dragTab = s.orders[dragIndex];
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

        delete s.list[tabId];
        return {
          list: { ...s.list },
          activeTab,
          orders: s.orders.filter((id) => id != tabId),
        };
      });
    },

    changeMeta: (tabId: TId, __meta: IEntityTab['__meta']) => {
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
        platformEmitter.emit(EPlatformTabs.ChangeState, [tabId, 'modified']);
      } else if (tab.__meta.hasChange === true && __meta.hasChange === false) {
        platformEmitter.emit(EPlatformTabs.ChangeState, [tabId, 'default']);
      }
    },

    changeActiveTab: (tabId) => {
      set({ activeTab: tabId });
    },

    changeRootKeys: (tabId: TId, updatedTab: Partial<IEntityTab>) => {
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

    open: (entity, entityMeta) => {
      if (!entityMeta?.type) return [null, null];
      const { list, orders, activeTab, changeActiveTab, open } = get();
      // if (!type) {
      //   if (orders.length === 0) type = 'request';
      //   else {
      //     const tab =
      //       activeTab === 'home'
      //         ? list[orders[orders.length - 1]]
      //         : list[activeTab];
      //     type = tab?.entity.type;
      //   }
      // }

      if (entityMeta?.id) {
        const tabAlreadyExists = Object.values(list).find(
          (l) => l?.__meta?.entityId == entityMeta.id
        );
        if (tabAlreadyExists) {
          changeActiveTab(tabAlreadyExists.id);
          return [null, null];
        }
      }

      const tabId = nanoid();
      const tab: IEntityTab<typeof entity> = {
        id: tabId,
        name:
          entity.name || entity.__meta?.name || `untitled ${entityMeta.type}`,
        entity,
        __meta: {
          entityId: entityMeta.id,
          entityType: entityMeta.type,
          isSaved: !!entity.id,
          hasChange: false,
          isFresh: true,
          isDeleted: false,
          isHistoryTab: false,
          revision: 1,
        },
      };

      const _orders = [...orders, tabId];
      set({
        list: { ...list, [tabId]: tab },
        activeTab: tabId,
        orders: _orders,
      });
      return [tab, _orders];
    },

    close: {
      all: () => {
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
