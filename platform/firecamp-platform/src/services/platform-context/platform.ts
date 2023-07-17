import { nanoid } from 'nanoid';
import { TId } from '@firecamp/types';
import { Regex } from '../../constants';
import { useTabStore } from '../../store/tab';
import { ETabEntityTypes } from '../../components/tabs/types';
import { useWorkspaceStore } from '../../store/workspace';
import { useExplorerStore } from '../../store/explorer';
import { useEnvStore } from '../../store/environment';
import { usePlatformStore } from '../../store/platform';
import { platformEmitter } from '../platform-emitter';
import { confirm } from './prompt.service';
import platformContext from '.';

const platform = {
  /** open a create workspace prompt */
  createWorkspacePrompt: async () => {
    const { create: createWrs } = useWorkspaceStore.getState();
    if (!platformContext.app.user.isLoggedIn()) {
      return platformContext.app.modals.openSignIn();
    }
    platformContext.window
      .promptInput({
        header: 'Create New Workspace',
        label: 'Workspace Name',
        placeholder: 'type workspace name',
        texts: { btnOking: 'Creating...' },
        value: '',
        validator: (val) => {
          if (!val || val.length < 6) {
            return {
              isValid: false,
              message: 'The workspace name must have minimum 6 characters.',
            };
          }
          const isValid = Regex.WorkspaceName.test(val);
          return {
            isValid,
            message:
              !isValid &&
              'The workspace name must not contain any spaces or special characters.',
          };
        },
        executor: (name) => {
          const { organization } = usePlatformStore.getState();
          return createWrs({ name, orgId: organization?.__ref.id });
        },
        onError: (e) => {
          platformContext.app.notify.alert(
            e?.response?.data?.message || e.message
          );
        },
      })
      .then((wrs) => {
        platformContext.app.notify.success(
          'The workspace is created successfully.'
        );
        confirm({
          title: 'Do you want to switch to the newly created workspace?',
          texts: {
            btnConfirm: 'Yes, switch to the workspace.',
          },
        }).then((isConfirmed) => {
          if (isConfirmed) {
            platformContext.app.switchWorkspace(wrs);
          }
        });
      });
  },

  /** open a create workspace prompt */
  createOrganizationPrompt: async () => {
    const { createOrg } = useWorkspaceStore.getState();
    if (!platformContext.app.user.isLoggedIn()) {
      return platformContext.app.modals.openSignIn();
    }
    platformContext.window
      .promptInput({
        header: 'Create your own organization',
        label: 'Organization Name',
        placeholder: 'type org name',
        texts: { btnOking: 'Creating...' },
        value: '',
        validator: (val) => {
          if (!val || val.length < 4) {
            return {
              isValid: false,
              message: 'The org name must have minimum 4 characters.',
            };
          }
          const isValid = Regex.OrgName.test(val);
          return {
            isValid,
            message:
              !isValid &&
              'The org name must not contain any spaces or special characters.',
          };
        },
        executor: (name) => {
          return createOrg({ name });
        },
        onError: (e) => {
          platformContext.app.notify.alert(
            e?.response?.data?.message || e.message
          );
        },
      })
      .then((res) => {
        platformContext.app.notify.success(
          'The organization is created successfully with default workspace named `Main Workspace`'
        );
        confirm({
          title: 'Do you want to switch to the newly created workspace?',
          texts: {
            btnConfirm: 'Yes, switch to the workspace.',
          },
        }).then((isConfirmed) => {
          if (isConfirmed) {
            platformContext.app.switchWorkspace(res.workspace, res.org);
          }
        });
      });
  },

  /** open a create collection prompt */
  createCollectionPrompt: () => {
    const { createCollection } = useExplorerStore.getState();
    if (!platformContext.app.user.isLoggedIn()) {
      return platformContext.app.modals.openSignIn();
    }
    platformContext.window
      .promptInput({
        header: 'Create New Collection',
        label: 'Collection Name',
        placeholder: 'type collection name',
        texts: { btnOking: 'Creating...' },
        value: '',
        validator: (val) => {
          if (!val || val.length < 4) {
            return {
              isValid: false,
              message: 'The collection name must have minimum 4 characters.',
            };
          }
          const isValid = Regex.CollectionName.test(val);
          return {
            isValid,
            message:
              !isValid &&
              'The collection name must not contain any special characters.',
          };
        },
        executor: (name) => createCollection({ name, description: '' }),
        onError: (e) => {
          platformContext.app.notify.alert(
            e?.response?.data?.message || e.message
          );
        },
      })
      .then((res) => {
        // console.log(res, 1111);
      });
  },

  /** open a create environment prompt */
  createEnvironmentPrompt: () => {
    if (!platformContext.app.user.isLoggedIn()) {
      return platformContext.app.modals.openSignIn();
    }
    const { createEnvironment } = useEnvStore.getState();
    platformContext.window
      .promptInput({
        header: 'Create New Environment',
        label: 'Environment Name',
        placeholder: 'type environment name',
        texts: { btnOking: 'Creating...' },
        value: '',
        validator: (val) => {
          if (!val || val.length < 3) {
            return {
              isValid: false,
              message: 'The environment name must have minimum 3 characters.',
            };
          }
          const isValid = Regex.EnvironmentName.test(val);
          return {
            isValid,
            message:
              !isValid &&
              'The environment name must not contain any special characters.',
          };
        },
        executor: (name) => {
          const { workspace } = useWorkspaceStore.getState();
          return createEnvironment({
            name,
            description: '',
            variables: [],
            __ref: { id: nanoid(), workspaceId: workspace.__ref.id },
          });
        },
        onError: (e) => {
          platformContext.app.notify.alert(
            e?.response?.data?.message || e.message
          );
        },
      })
      .then((env) => {
        const { open: openTab } = useTabStore.getState();
        openTab(env, { id: env.__ref.id, type: ETabEntityTypes.Environment });
        // console.log(env, 1111);
      });
  },

  subscribeEntityChanges: (reqId: TId, cb) => {
    const evtName = `tab:entity:changes:${reqId}`;
    platformEmitter.on(evtName, cb);
    return () => {
      platformEmitter.off(evtName);
    };
  },
};

export { platform };
