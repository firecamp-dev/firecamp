let cacheTabs = [];

/**
 * Return a tab by it's id
 * @param tabId tab id
 * @returns
 */
export const getTab = (tabId: string): any =>
  cacheTabs.find((tab) => tab.id === tabId);

/**
 * Return all cache tabs
 * @returns
 */
export const getAllTabs = (): any[] => cacheTabs;

/**
 * Add/Update cache tab in the list
 * @param tabId tab id
 * @param tabPayload tab payload
 * @returns
 */
export const setTab = (tabId: string, tabPayload: any): void => {
  // Return if tab id is not passed
  if (!tabId) return;

  let newCacheTabs = [];

  // Updating cache tab if already exist in the list
  if (cacheTabs.map((tab) => tab.id).includes(tabId)) {
    let tabToUpdate = {};
    let tabIndex = null;

    // Find cache tab
    tabToUpdate = cacheTabs.find((tab) => tab.id === tabId);

    // Find cache tab index
    tabIndex = cacheTabs.findIndex((tab) => tab.id === tabId);

    // Merge updates if existing tab found
    if (tabToUpdate) {
      tabToUpdate = Object.assign(tabToUpdate, { ...tabPayload });

      // Add the cache tab at the specific position
      newCacheTabs = [
        ...cacheTabs.slice(0, tabIndex),
        tabToUpdate,
        ...cacheTabs.slice(tabIndex + 1),
      ];

      // Re-initialize the cache tabs list
      cacheTabs = [...newCacheTabs];
    }
  } else {
    // Add tab as a new tab into the existing cache tabs list
    cacheTabs = [...cacheTabs, { id: tabId, ...tabPayload }];
  }

  // F.appStore.tab.storeCacheTabsInDBWithDebounce()
};

/**
 * Remove tab from the cache tab list by it's id
 * @param tabId tab id
 */
export const removeTab = async (tabId: string): Promise<void> => {
  // Filter tab to remove from the cache tab list
  cacheTabs = cacheTabs.filter((tab) => tab.id !== tabId);

  // F.appStore.tab.storeCacheTabsInDBWithDebounce()
};

/**
 * TODO: Why returning Promise?
 * Remove all cache tabs from the cache tab list
 * @returns
 */
export const closeAllTabs = async (): Promise<void> => {
  // RE-initialize cache tab list with empty array
  cacheTabs = [];

  // F.appStore.tab.storeCacheTabsInDBWithDebounce()

  return Promise.resolve();
};

/**
 * Add received tabs into the cache tabs list
 * @param tabs tabs list
 */
export const setAllTabs = (tabs = []): void => {
  cacheTabs = [...tabs];
};
