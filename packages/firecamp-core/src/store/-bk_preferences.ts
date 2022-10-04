import { _string } from '@firecamp/utils';
import create from 'zustand';
import { Preferences as _Preferences } from '../constants';

const initialState = {
  active_org: '',
  org_active_workspace: {},
  proxies: [],
  schemas: [],
  certificates: [],
  activeTabWrsEnv: '', // active workspace's active environment
  project_active_environment: {}, // active workspace's projects list with active environment
};

export const preferenceStore = create((set, get) => ({
  ...initialState,

  // Add proxies
  ['ADD_PROXIES']: (proxies = []) => {
    set({ proxies: new Array(...proxies) });
  },

  // Add proxy
  ['ADD_PROXY']: (proxy = {}) => {
    if (proxy?._meta?.id) {
      let proxies = new Array(...(get().proxies || []));
      proxies = [...proxies, proxy];
      set({ proxies });
    }
  },

  // Update proxy
  ['UPDATE_PROXY']: (proxy = {}) => {
    if (proxy?._meta?.id) {
      let proxies = new Array(...(get().proxies || []));
      let index = proxies.findIndex((p) => p._meta.id === proxy?._meta?.id);
      if (index !== -1) {
        proxies[index] = proxy;
        set({
          proxies: proxies,
        });
      }
    }
  },

  // Remove proxy
  ['REMOVE_PROXY']: (_meta = {}) => {
    if (_meta?.id) {
      let proxies = new Array(...(get().proxies || []));

      let index = proxies.findIndex((p) => p._meta.id === _meta?.id);
      proxies = [...proxies.slice(0, index), ...proxies.slice(index + 1)];
      set({ proxies: proxies });
    }
  },

  // Add Certificates
  ['ADD_CERTIFICATES']: (certificates = []) => {
    set({ certificates: new Array(...certificates) });
  },

  // Add certificate
  ['ADD_CERTIFICATE']: (certificate = {}) => {
    if (certificate?._meta?.id) {
      let existingCertificates = new Array(...(get().certificates || []));
      existingCertificates = [...existingCertificates, certificate];
      set({
        certificates: existingCertificates,
      });
    }
  },

  // Update certificate
  ['UPDATE_CERTIFICATE']: (certificate = {}) => {
    if (certificate?._meta?.id) {
      let certificates = new Array(...(get().certificates || []));
      let index = certificates.findIndex(
        (c) => c._meta.id === certificate?._meta?.id
      );
      if (index !== -1) {
        certificates[index] = certificate;
        set({
          certificates: certificates,
        });
      }
    }
  },

  // Remove certificate
  ['REMOVE_CERTIFICATE']: (_meta = {}) => {
    if (_meta?.id) {
      let certificates = new Array(...(get().certificates || []));
      let index = certificates.findIndex((c) => c._meta.id === _meta?.id);
      certificates = [
        ...certificates.slice(0, index),
        ...certificates.slice(index + 1),
      ];
      set({ certificates: certificates });
    }
  },

  // Add schemas
  ['ADD_SCHEMAS']: (schemas = []) => {
    set({ schemas: new Array(...schemas) });
  },

  // Fetch schemas by collection_id
  ['FETCH_SCHEMAS_BY_COLLECTIONID']: (collection_id = '') => {
    let schemas = new Array(...(get().schemas || []));
    let schemasByCollectionId = schemas.filter(
      (s) => s?._meta?.collection_id === collection_id
    );

    return schemasByCollectionId;
  },

  // Add schema
  ['ADD_SCHEMA']: (schema = {}) => {
    if (schema?._meta?.id) {
      let schemas = new Array(...(get().schemas || []));
      schemas = [...schemas, schema];
      set({
        schemas: schemas,
      });
    }
  },

  // Update schema
  ['UPDATE_SCHEMA']: (schema = {}) => {
    if (schema?._meta?.id) {
      let schemas = new Array(...(get().schemas || []));
      let index = schemas.findIndex((s) => s._meta.id === schema?._meta?.id);
      if (index !== -1) {
        schemas[index] = schema;
        set({
          schemas: schemas,
        });
      }
    }
  },

  // Remove schema
  ['REMOVE_SCHEMA']: (_meta = {}) => {
    console.log({ 1: _meta });
    if (_meta?.id) {
      let schemas = new Array(...(get().schemas || []));
      console.log({ schemas });
      let index = schemas.findIndex((c) => c._meta.id === _meta?.id);
      schemas = [...schemas.slice(0, index), ...schemas.slice(index + 1)];
      set({ schemas: schemas });
    }
  },

  // Update active workspace
  ['UPDATE_ACTIVE_WORKSPACE']: () => {},

  // Update
  ['UPDATE']: (updates = initialState) => {
    set((state) => {
      return {
        ...state,
        ...updates,
      };
    });
  },
}));

export const Preferences = {
  active_workspace: '',

  /**
   * init: Fetch preferences from DB
   */
  init: async () => {
    try {
      // Initialise organization active workspace
      await Preferences.initOrgActiveWorkspace();

      // get all proxy and set to store
      let proxies = [];
      // console.log({ proxiesFetched: proxies });
      preferenceStore.getState()['ADD_PROXIES'](proxies);

      // get all certificates and set to store
      let certificates = [];
      preferenceStore.getState()['ADD_CERTIFICATES'](certificates);

      // get active environment for workspace and set to store
      let wrsActiveEnvironment = '';
    } catch (error) {
      console.error({
        API: 'Preferences.init',
        error,
      });
    }

    return Promise.resolve();
  },

  // PROXY

  /**
   *
   * @param {*} proxy:
   * @param {*} commitAction
   */
  addProxy: async (proxy = {}, commitAction = false) => {
    preferenceStore.getState()['ADD_PROXY'](proxy);
  },

  /**
   *
   * @param {*} proxy
   * @param {*} commitAction
   */
  updateProxy: async (proxy = {}, commitAction = false) => {
    preferenceStore.getState()['UPDATE_PROXY'](proxy);
  },

  /**
   *
   * @param {*} _meta
   * @param {*} commitAction
   */
  removeProxy: async (_meta = {}, commitAction = false) => {
    preferenceStore.getState()['REMOVE_PROXY'](_meta);
  },

  // SCHEMA
  /**
   *
   * @param {*} schema
   * @param {*} commitAction
   */
  addSchema: async (schema = {}, commitAction = false) => {
    preferenceStore.getState()['ADD_SCHEMA'](schema);
  },

  /**
   *
   * @param {*} schema
   * @param {*} commitAction
   */
  updateSchema: async (schema = {}, commitAction = false) => {
    preferenceStore.getState()['UPDATE_SCHEMA'](schema);
  },

  // CERTIFICATE
  /**
   *
   * @param {*} certificate
   * @param {*} commitAction
   */
  addCertificate: async (certificate = {}, commitAction = false) => {
    preferenceStore.getState()['ADD_CERTIFICATE'](certificate);
  },

  /**
   *
   * @param {*} certificate
   * @param {*} commitAction
   */
  updateCertificate: async (certificate = {}, commitAction = false) => {
    preferenceStore.getState()['UPDATE_CERTIFICATE'](certificate);
  },

  /**
   *
   * @param {*} _meta
   * @param {*} commitAction
   */
  removeCertificate: async (_meta = {}, commitAction = false) => {
    preferenceStore.getState()['REMOVE_CERTIFICATE'](_meta);
  },

  // WORKSPACE_ACTIVE_ENVIRONMENT
  /**
   * Update workspace active environment in user preference
   * @param {*} env_id : <type: String> environment id
   */
  updateWrsActiveEnv: async (env_id) => {
    try {
      if (env_id) {
        // preferenceStore.getState()["UPDATE"]({
        //   activeTabWrsEnv: env_id,
        // });
      }
    } catch (error) {
      console.error({
        API: 'preferences.updateWrsActiveEnv',
        args: { env_id },
        error,
      });
    }
  },

  // PROJECT_ACTIVE_ENVIRONMENT
  /**
   * Update project active environment in user preference
   * @param {*} wrs_id : <type: String> project id for which user need to update active environment
   * @param {*} env_id : <type: String> environment id
   */
  updatePrjActiveEnv: async (col_id, env_id) => {
    try {
      if (col_id && env_id) {
        // Update zustand store
        let existingPrjActiveEnv = Object.create(
          preferenceStore.getState().project_active_environment || {}
        );

        existingPrjActiveEnv = {
          ...existingPrjActiveEnv,
          [col_id]: env_id,
        };

        // Update DB
        // await F.db.preference.setProjectActiveEnvironment(col_id, env_id);

        // Emit set active environment for project
        // F.cloudAPI.socket.setActiveEnvironment({
        //   item_type: 'P',
        //   item_id: col_id,
        //   env_id: env_id,
        // });

        // F.notification.success(
        //   'default active environment has been updated successfully!!',
        //   {
        //     labels: { success: 'Default active environment' },
        //   }
        // );
      }
    } catch (error) {
      console.error({
        API: 'preferences.updatePrjActiveEnv',
        args: { col_id, env_id },
        error,
      });
      // F.notification.alert('failed to update default active environment', {
      //   labels: { alert: 'Default active environment' },
      // });
    }
  },

  setToInitial: () => {
    preferenceStore.getState()['UPDATE'](initialState);
  },
};
