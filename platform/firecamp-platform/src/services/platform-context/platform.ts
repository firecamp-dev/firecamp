import { confirm } from './prompt.service';
import { RE } from '../../types';
import platformContext from '.';
import { useWorkspaceStore } from '../../store/workspace';

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
          if (!val || val.length < 4) {
            return {
              isValid: false,
              message: 'The workspace name must have minimum 4 characters.',
            };
          }
          const isValid = RE.NoSpecialCharacters.test(val);
          return {
            isValid,
            message:
              !isValid &&
              'The workspace name must not contain any special characters.',
          };
        },
        executor: (name) => {
          return createWrs({ name, orgId: '21456' });
        },
        onError: (e) => {
          platformContext.app.notify.alert(
            e?.response?.data?.message || e.message
          );
        },
      })
      .then((res) => {
        // console.log(res, 1111);
        confirm({
          title: 'Do you want to switch to the newly created workspace?',
          texts: {
            btnConfirm: 'Yes, switch to the workspace.',
          },
        }).then((isConfirmed) => {
          if (isConfirmed) console.log(true);
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
          const isValid = RE.NoSpecialCharacters.test(val);
          return {
            isValid,
            message:
              !isValid &&
              'The org name must not contain any special characters.',
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
        // console.log(res, 1111);
        confirm({
          title: 'Do you want to switch to the newly created workspace?',
          texts: {
            btnConfirm: 'Yes, switch to the workspace.',
          },
        }).then((isConfirmed) => {
          if (isConfirmed) console.log(true);
        });
      });
  },

  /** open a create collection prompt */
  createCollectionPrompt: () => {
    const { createCollection } = useWorkspaceStore.getState();
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
          const isValid = RE.NoSpecialCharacters.test(val);
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
};

export { platform };
