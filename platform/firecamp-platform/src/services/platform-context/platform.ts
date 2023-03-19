import { useWorkspaceStore } from '../../store/workspace';
import { RE } from '../../types';
import platformContext from '.';

const platform = {
  /** open a create workspace prompt */
  createWorkspacePrompt: async () => {
    const { createCollection } = useWorkspaceStore.getState();
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
          if (!val || val.length < 3) {
            return {
              isValid: false,
              message: 'The workspace name must have minimum 3 characters.',
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
        // executor: (name) => {
        //   // createCollection({ name, description: '' })
        // },
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

  /** open a create workspace prompt */
  createOrganizationPrompt: async () => {
    const { createCollection } = useWorkspaceStore.getState();
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
          if (!val || val.length < 3) {
            return {
              isValid: false,
              message: 'The org name must have minimum 3 characters.',
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
        // executor: (name) => {
        //   // createCollection({ name, description: '' })
        // },
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
