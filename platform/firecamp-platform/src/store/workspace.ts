import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import _reject from 'lodash/reject';
import { _object, _string } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { TId, IWorkspace, EWorkspaceType } from '@firecamp/types';
import platformContext from '../services/platform-context';
import { EUserRolesWorkspace } from '../types';
import { useTabStore } from './tab';
import { ETabEntityTypes } from '../components/tabs/types';

const initialState = {
  workspace: {
    name: 'My Workspace',
    __meta: { cOrders: [], type: EWorkspaceType.Personal },
    __ref: {
      id: nanoid(), // only when user is guest
    },
  },
};

export interface IWorkspaceStore {
  // organization
  createOrg: (payload: TCreateOrgPayload) => Promise<any>;
  checkOrgNameAvailability: (name: string) => Promise<any>;

  // workspace
  workspace: Partial<IWorkspace>;
  getWorkspaceId: () => TId;
  setWorkspace: (workspace: IWorkspace) => void;
  create: (payload: TCreateWrsPayload) => Promise<any>;
  update: (updates: any, commitAction: boolean, updateDB: boolean) => void;
  remove: (workspaceId: string) => void;
  checkNameAvailability: (name: string, orgId?: string) => Promise<any>;
  switch: (workspaceId: string, activeWorkspace: string) => void;

  // invitations
  inviteNonOrgMembers: (payload: {
    role: EUserRolesWorkspace;
    members: { name: string; email: string }[];
  }) => Promise<any>;

  // invitations
  inviteOrgMembers: (
    members: { id: string; name: string; role: number }[]
  ) => Promise<any>;

  openImportTab: () => void;

  // common
  dispose: () => void;
}

export const useWorkspaceStore = create<IWorkspaceStore>(
  devtools((set, get) => ({
    workspace: { ...initialState.workspace },

    setWorkspace: (workspace: IWorkspace) => {
      set((s) => ({ workspace }));
    },

    // create a new workspace #v3
    // if `orgId` is presented then It'll be an organizational wrs or else personal
    create: async (payload: TCreateWrsPayload) => {
      return Rest.workspace.create(payload).then((res) => res.data);
    },

    // check the workspace name is available or not
    // if `orgId` is presented then It'll be an organizational wrs or else personal
    checkNameAvailability: (name: string, orgId?: string) => {
      return Rest.workspace.availability({ name, orgId });
    },

    /**
     * switch: To switch another workspace
     */
    switch: async (workspaceId: string, activeWorkspace: string) => {},

    update: async (updates = {}) => {
      // const workspace = get().workspace;
      // const updatedWorkspace = new Object(_object.mergeDeep(workspace, updates));
      // set((s) => ({
      //   workspace: { ...s.workspace, ...updatedWorkspace },
      // }));
    },

    remove: async (workspaceId = '') => {},

    getWorkspaceId: (): TId => {
      const state = get();
      return state.workspace.__ref.id;
    },

    //organization
    // create a new workspace #v3
    createOrg: async (payload: TCreateOrgPayload) => {
      return Rest.organization.create(payload).then((res) => res.data);
    },
    // check the org name is available or not
    checkOrgNameAvailability: (name: string) => {
      return Rest.organization.availability({ name });
    },

    //invitation
    /** invite non org members */
    inviteNonOrgMembers: (payload) => {
      const { workspace } = get();
      return Rest.invitation
        .inviteNonOrgMembers({
          workspaceId: workspace.__ref.id,
          ...payload,
        })
        .then((res) => {
          platformContext.app.notify.success(
            'The invitation(s) has been sent successfully'
          );
          return res.data;
        })
        .catch((e) => {
          platformContext.app.notify.alert(
            e.response?.data?.message || e.message
          );
        });
    },

    /** invite org members */
    inviteOrgMembers: (members) => {
      const { workspace } = get();
      return Rest.invitation
        .inviteOrgMembers({ workspaceId: workspace.__ref.id, members })
        .then((res) => {
          platformContext.app.notify.success(
            'The invitation has been sent successfully'
          );
          return res.data;
        })
        .catch((e) => {
          platformContext.app.notify.alert(
            e.response?.data?.message || e.message
          );
        });
    },

    openImportTab: () => {
      const { open } = useTabStore.getState();
      open(
        { name: 'Import API Collection', description: '' },
        { id: 'import-api-collection', type: ETabEntityTypes.Import }
      );
    },

    // dispose whole store and reset to initial state
    dispose: () => {
      set((s) => ({ ...initialState }));
    },
  }))
);

type TCreateOrgPayload = { name: string };
type TCreateWrsPayload = { name: string; orgId: string };
