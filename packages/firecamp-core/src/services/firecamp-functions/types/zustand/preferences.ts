export declare const preferenceStore: import('zustand').UseStore<object>;
export interface IPreferences {
  active_workspace: string;
  /**
   * init: Fetch preferences from DB
   */
  init: () => Promise<void>;
  initOrgActiveWorkspace: () => Promise<void>;
  fetchTheme: () => Promise<any>;
  updateTheme: (theme?: {
    name: string;
    class: string;
    mode: any;
    color: any;
  }) => Promise<void>;
  /**
   * Update active workspace in to DB, zustand store and emit event
   */
  updateOrgActiveWorkspace: (
    orgId?: string,
    workspaceId?: string
  ) => Promise<{}>;
  /**
   *
   * @param {*} proxy:
   * @param {*} commitAction
   */
  addProxy: (proxy?: {}, commitAction?: boolean) => Promise<void>;
  /**
   *
   * @param {*} proxy
   * @param {*} commitAction
   */
  updateProxy: (proxy?: {}, commitAction?: boolean) => Promise<void>;
  /**
   *
   * @param {*} _meta
   * @param {*} commitAction
   */
  removeProxy: (_meta?: {}, commitAction?: boolean) => Promise<void>;
  /**
   *
   * @param {*} schema
   * @param {*} commitAction
   */
  addSchema: (schema?: {}, commitAction?: boolean) => Promise<void>;
  /**
   *
   * @param {*} schema
   * @param {*} commitAction
   */
  updateSchema: (schema?: {}, commitAction?: boolean) => Promise<void>;
  /**
   *
   * @param {*} _meta
   * @param {*} commitAction
   */
  removeSchema: (_meta?: {}, commitAction?: boolean) => Promise<void>;
  /**
   *
   * @param {*} certificate
   * @param {*} commitAction
   */
  addCertificate: (certificate?: {}, commitAction?: boolean) => Promise<void>;
  /**
   *
   * @param {*} certificate
   * @param {*} commitAction
   */
  updateCertificate: (
    certificate?: {},
    commitAction?: boolean
  ) => Promise<void>;
  /**
   *
   * @param {*} _meta
   * @param {*} commitAction
   */
  removeCertificate: (_meta?: {}, commitAction?: boolean) => Promise<void>;
  /**
   * Update workspace active environment in user preference
   * @param {*} env_id : <type: String> environment id
   */
  updateWrsActiveEnv: (env_id: any) => Promise<void>;
  /**
   * Update project active environment in user preference
   * @param {*} wrs_id : <type: String> project id for which user need to update active environment
   * @param {*} env_id : <type: String> environment id
   */
  updatePrjActiveEnv: (col_id: any, env_id: any) => Promise<void>;
  setToInitial: () => void;
}
