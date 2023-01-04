import { FC, useEffect, useState } from 'react';
import { Rest } from '@firecamp/cloud-apis';
import {
  Input,
  TabHeader,
  Button,
  Modal,
  IModal,
  ProgressBar,
  Editor,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import {
  IEnvironment,
  EEnvironmentScope,
  EEditorLanguage,
} from '@firecamp/types';

import { useWorkspaceStore } from '../../../store/workspace';
import { useModalStore } from '../../../store/modal';
import { useEnvStore } from '../../../store/environment';
import { RE } from '../../../types';
import platformContext from '../../../services/platform-context';

type TModalMeta = {
  scope: EEnvironmentScope;
  workspaceId: string;
  collectionId?: string;
  envId: string;
};

const ManageEnvironment: FC<IModal> = ({ onClose = () => {} }) => {
  const { workspace, explorer } = useWorkspaceStore.getState();
  const { collections } = explorer;
  const { fetchEnvironment, updateEnvironment } = useEnvStore.getState();
  const { scope, envId, collectionId } = useModalStore.getState()
    .__meta as TModalMeta;

  const [isFetching, setIsFetching] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState({ name: '', variables: '' });

  let collection: any;
  if (scope == EEnvironmentScope.Collection) {
    collection = collections.find((c) => c.__ref.id == collectionId);
    console.log(collection, 'collection....');
  }

  const [env, setEnv] = useState({
    name: '',
    description: '',
    variables: JSON.stringify({}, null, 4),
    __meta: { type: EEnvironmentScope.Collection, visibility: 2 },
  });

  //load environment
  useEffect(() => {
    setIsFetching(true);
    Rest.environment
      .fetch(envId)
      .then((r) => {
        fetchEnvironment(envId).then((e) => {
          console.log(e, 'current env');
          setEnv({
            ...e,
            variables: JSON.stringify(e.variables || {}, null, 4),
          });
          setIsFetching(false);
        });
      })
      .catch((e) => {
        platformContext.app.notify.alert(
          e.response?.data?.message || e.message
        );
        console.log(e);
      });
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (error.name || error.variables) setError({ name: '', variables: '' });
    setEnv((c) => ({ ...c, [name]: value }));
  };

  const onVariableEditorChange = (e) => {
    const { value } = e.target;
    if (error.name || error.variables) setError({ name: '', variables: '' });
    setEnv((c) => ({ ...c, variables: value }));
  };

  const onCreate = () => {
    if (isRequesting) return;
    const name = env.name.trim();
    if (!name || name.length < 3) {
      setError({
        name: 'The environment name must have minimum 3 characters',
        variables: '',
      });
      return;
    }
    if (!RE.NoSpecialCharacters.test(name)) {
      setError({
        name: 'The environment name must not contain any special characters.',
        variables: '',
      });
      return;
    }

    let variables;
    try {
      variables = JSON.parse(env.variables);
    } catch (e) {
      console.log(e);
      setError({ name: '', variables: 'The variables are invalid' });
      return;
    }

    const _env: Partial<IEnvironment> = { name, variables, __meta: env.__meta };

    console.log(_env, '_env');

    setIsRequesting(true);
    updateEnvironment(envId, _env)
      .then((r) => {
        console.log(r, 'r...... update env');
        setTimeout(() => platformContext.app.modals.close());
      })
      .catch((e) => {
        console.log(e.response, e.response?.data);
        platformContext.app.notify.alert(
          e?.response?.data?.message || e.message
        );
      })
      .finally(() => {
        setIsRequesting(false);
      });
  };

  if (isFetching) {
    return (
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <div className="flex items-center justify-center h-full w-full">
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2 text-center">
            Fetching...
          </label>
        </div>
      </Modal.Body>
    );
  }

  return (
    <>
      <Modal.Header className="with-divider">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium">
          Manage Environment
        </div>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <div className="p-6">
          {/* <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            ENTER A NEW ENVIRONMENT INFO
          </label> */}
          <div className="mt-4">
            <div className="items-center mb-4">
              <label
                className="text-appForeground text-sm block mb-1"
                htmlFor="envBane"
              >
                Scope:{' '}
                {scope == EEnvironmentScope.Collection
                  ? 'Collection'
                  : 'Workspace'}
              </label>
              <label className="text-sm font-semibold leading-3 block text-appForegroundInActive w-full relative mb-2">
                {scope == EEnvironmentScope.Collection
                  ? collection?.name
                  : workspace?.name}
              </label>
            </div>
            <Input
              autoFocus={true}
              label="Name"
              placeholder="Environment name"
              name={'name'}
              value={env.name}
              onChange={onChange}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={error.name}
              // iconPosition="right"
              // icon={<VscEdit />}
            />
          </div>

          <div className="">
            <label
              className="text-appForeground text-sm mb-1 block"
              htmlFor="variables"
            >
              Visibility
            </label>
            <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
              {env.__meta.visibility == 2 ? 'Private' : 'Public'}
            </label>

            <span className="text-sm font-normal text-appForegroundInActive block mt-1">
              {env.__meta.visibility == 2
                ? 'This environment is private and will only be accessible to you'
                : 'This environment is public and will be accessible to all members of the workspace'}
            </span>
          </div>

          <div className="mt-4">
            <label
              className="text-appForeground text-sm mb-1 block"
              htmlFor="variables"
            >
              Variables
            </label>
            <span className="text-sm font-normal text-appForegroundInActive block mt-1">
              Variables will be valid JSON in key-value pair. ex.{' '}
              {`{ "host": "https://myapi.com" }`}
            </span>
            <Editor
              language={EEditorLanguage.Json}
              value={env.variables}
              onChange={onVariableEditorChange}
              monacoOptions={{
                extraEditorClassName: `border border-inputBorder rounded-sm p-2 leading-5 
                  outline-none placeholder-inputPlaceholder 
                  text-base focus:bg-inputFocusBackground w-full
                  bg-inputBackground`,
                fontSize: '14px',
                height: '300px',
                wordWrap: 'off',
              }}
              className="!h-80"
            />
            <div className="text-sm font-light text-error block absolute">
              {error.variables}
            </div>
          </div>
        </div>
        <div className="!px-6 py-4">
          <TabHeader className="p-0">
            <TabHeader.Right>
              <Button
                text="Cancel"
                secondary
                transparent={true}
                sm
                onClick={(e) => onClose()}
                ghost={true}
              />
              <Button
                text={isRequesting ? 'Updating...' : 'Update'}
                primary
                sm
                onClick={onCreate}
                disabled={isRequesting}
              />
            </TabHeader.Right>
          </TabHeader>
        </div>
      </Modal.Body>
    </>
  );
};

export default ManageEnvironment;
