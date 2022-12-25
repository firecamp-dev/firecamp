import { FC, useState } from 'react';
import {
  Input,
  TabHeader,
  Button,
  Modal,
  IModal,
  ProgressBar,
  Editor,
  CheckboxGroup,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import { EEnvironmentScope } from '@firecamp/types';

import { useEnvStore } from '../../../store/environment';
import { useWorkspaceStore } from '../../../store/workspace';
import { useModalStore } from '../../../store/modal';
import { RE } from '../../../types'

type TModalMeta = {
  scope: EEnvironmentScope;
  collectionId?: string;
};

const CreateEnvironment: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const { workspace, explorer } = useWorkspaceStore.getState();
  const { collections } = explorer;
  const createEnvironment = useEnvStore.getState().createEnvironment;
  const { scope, collectionId } = useModalStore.getState().meta as TModalMeta;
  let collection: any;
  if (scope == EEnvironmentScope.Collection) {
    collection = collections.find((c) => c.__ref.id == collectionId);
    console.log(collection, 'collection....');
  }

  const [env, setEnv] = useState({
    name: '',
    variables: JSON.stringify({ variable_key: 'value' }, null, 4),
    __meta: { type: scope, visibility: 1 },
  });

  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState({ name: '', variables: '' });

  const onChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    if (error.name || error.variables) setError({ name: '', variables: '' });
    setEnv((c) => ({ ...c, [name]: value }));
  };

  const onVariableEditorChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    if (error.name || error.variables) setError({ name: '', variables: '' });
    setEnv((c) => ({ ...c, variables: value }));
  };

  const onChangeVisibility = (value: { private: boolean }) => {
    setEnv((s) => ({
      ...s,
      meta: { ...s.__meta, visibility: value.private == true ? 2 : 1 },
    }));
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

    let variables: any;
    try {
      variables = JSON.parse(env.variables);
    } catch (e) {
      console.log(e);
      setError({ name: '', variables: 'The variables are invalid' });
      return;
    }

    const _env = {
      name,
      variables,
      __meta: env.__meta,
      __ref: { workspaceId: workspace.__ref.id },
    };
    if (scope == EEnvironmentScope.Collection) {
      //@ts-ignore
      _env.__ref.collectionId = collectionId;
    }

    console.log(_env, '_env');

    setIsRequesting(true);
    createEnvironment(_env)
      .then((r) => {
        console.log(r, 'r......');
        platformContext.app.modals.close();
      })
      .catch((e) => {
        console.log(e.response, e.response?.data);
        platformContext.app.notifyalert(e?.response?.data?.message || e.message);
      })
      .finally(() => {
        setIsRequesting(false);
      });
  };

  const visibility = [
    {
      id: 'public',
      isChecked: env.__meta.visibility == 1,
      label: 'Public',
      showLabel: true,
      disabled: false,
    },
    {
      id: 'private',
      isChecked: env.__meta.visibility == 2,
      label: 'Private',
      showLabel: true,
      disabled: false,
    },
  ];
  return (
    <>
      <Modal.Header className="with-divider">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium">
          Create Environment
        </div>
      </Modal.Header>
      <Modal.Body className="flex flex-col">
        <ProgressBar active={isRequesting} />
        <div className="p-6 flex-1 overflow-auto">
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
              {/* <Dropdown
                isOpen={false}
                id="envName"
              >
                <Dropdown.Handler>
                  <Button
                    text="Environment"
                    xs
                    className="font-bold"
                    withCaret={true}
                    secondary
                  />
                </Dropdown.Handler>
                <Dropdown.Options
                />
              </Dropdown> */}
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
            <CheckboxGroup
              showLabel={false}
              list={visibility}
              onToggleCheck={onChangeVisibility}
            />
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
              language="json"
              value={env.variables}
              onChange={onVariableEditorChange}
              monacoOptions={{
                extraEditorClassName: `border border-inputBorder rounded-sm p-2 leading-5 
                  outline-none placeholder-inputPlaceholder 
                  text-base focus:bg-inputFocusBackground w-full
                  bg-inputBackground`,
                fontSize: '14px',
                height: '300px',
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
                text={isRequesting ? 'Creating...' : 'Create'}
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

export default CreateEnvironment;
