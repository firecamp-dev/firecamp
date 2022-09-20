// @ts-nocheck

// cahceTabs: Array// Keeps cacheTabs payload [{request, sync}]
let cacheTabs = [];

/**
 * cacheTabsFactory: To get and set cacheTabs
 * @returns {{getTab: (function(*)), getAllTabs: (function()), setTab: (function(*=, *=)), removeTab: (function(*))}}
 */
const cacheTabsFactory = () => ({
  /**
   * getTab: To get single tab by tab id.
   * @param tabId: String// Tab Id of needed tab.
   * @returns {*}
   */
  getTab: (tabId) => cacheTabs.find((t) => t.id === tabId),

  /**
   * getAllTabs: To get all cache tabs.
   * @returns {Array}
   */
  getAllTabs: () => cacheTabs,

  /**
   * setTab: To set (add/ update) tab in to cache tabs.
   * @param tabId: String// Tab id for which tab you wanted to add/ update chche tabs.
   * @param tabPayload: Object// {request:{//...react state}, sync:{//...local db sync payload}}
   */
  setTab: (tabId, tabPayload) => {
    // console.log(`add tab to cacheTabs: `, tabId, tabPayload);

    if (!tabId) return;

    let newCacheTabs = [];

    if (cacheTabs.map((t) => t.id).includes(tabId)) {
      let tabToUpdate = {};
      let tabIndex;
      tabToUpdate = cacheTabs.find((tab) => tab.id === tabId);
      // console.log(`tabToUpdate`, `before`, tabToUpdate)
      tabIndex = cacheTabs.findIndex((tab) => tab.id === tabId);
      if (tabToUpdate) {
        tabToUpdate = Object.assign(tabToUpdate, { ...tabPayload });
        newCacheTabs = [
          ...cacheTabs.slice(0, tabIndex),
          tabToUpdate,
          ...cacheTabs.slice(tabIndex + 1),
        ];
        // console.log(`newCacheTabs`, newCacheTabs);
        // console.log(`tabToUpdate`, tabToUpdate)
        cacheTabs = [...newCacheTabs];
      }
    } else {
      cacheTabs = [...cacheTabs, { id: tabId, ...tabPayload }];
    }
    // console.log(` cacheTabs===>`, cacheTabs);
    // F.appStore.tab.storeCacheTabsInDBWithDebounce();
  },

  /**
   * removeTab: To remove tab from cache tabs.
   * @param tabId: String// Tab's id which you wanted to remove from cache tab.
   */
  removeTab: async (tabId) => {
    const newCacheTabs = [];
    cacheTabs.map((t) => {
      if (t.id !== tabId) {
        newCacheTabs.push(t);
      }
    });
    cacheTabs = [...newCacheTabs];
    // F.appStore.tab.storeCacheTabsInDBWithDebounce();
  },

  closeAllTabs: () => {
    cacheTabs = [];
    // F.appStore.tab.storeCacheTabsInDBWithDebounce();
    return Promise.resolve({});
  },

  setAllTabs: (tabs = []) => {
    cacheTabs = [...tabs];
  },
});

// Object.assign(F, { cacheTabsFactory: cacheTabsFactory() });

export default cacheTabsFactory;
