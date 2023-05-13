import { FC, useEffect, useState } from 'react';
import {
  Input,
  TabHeader,
  Button,
  Modal,
  IModal,
  ProgressBar,
  Editor,
} from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import { EEditorLanguage } from '@firecamp/types';
import { useExplorerStore } from '../../../store/explorer';
import { useModalStore } from '../../../store/modal';
import { useEnvStore } from '../../../store/environment';
import { Regex } from '../../../constants';
import platformContext from '../../../services/platform-context';
import { ETabEntityTypes } from '../../tabs/types';
import { useTabStore } from '../../../store/tab';

type TModalMeta = {
  workspaceId: string;
  collectionId?: string;
  envId: string;
};

const CloneEnvironment: FC<IModal> = ({ onClose = () => {} }) => {
  const { open: openTab } = useTabStore.getState();
  const { explorer } = useExplorerStore.getState();
  const { collections } = explorer;
  const { fetchColEnvironment, cloneEnvironment } = useEnvStore.getState();
  const { envId, collectionId } = useModalStore.getState().__meta as TModalMeta;

  const [isFetching, setIsFetching] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState({ name: '' });

  if (!collectionId) {
    onClose();
    return <></>;
  }

  const collection = collections.find((c) => c.__ref.id == collectionId);
  console.log(collection, 'collection....');

  const [env, setEnv] = useState({
    name: '',
    description: '',
    variables: JSON.stringify({}, null, 4),
  });

  //load environment
  useEffect(() => {
    setIsFetching(true);
    fetchColEnvironment(envId)
      .then((e) => {
        console.log(e, 'current env');
        setEnv({
          ...e,
          variables: JSON.stringify(e.variables || {}, null, 4),
        });
        setName(e.name);
        setIsFetching(false);
      })
      .catch((e) => {
        platformContext.app.notify.alert(
          e.response?.data?.message || e.message
        );
        console.log(e);
      });
  }, []);

  const onChangeName = (e) => {
    const { value } = e.target;
    if (error.name) setError({ name: '' });
    setName(value);
  };

  const onCreate = () => {
    if (isRequesting) return;
    const _name = name.trim();
    if (!_name || _name.length < 3) {
      setError({
        name: 'The environment name must have minimum 3 characters',
      });
      return;
    }
    if (!Regex.EnvironmentName.test(_name)) {
      setError({
        name: 'The environment name must not contain any special characters.',
      });
      return;
    }

    console.log(_name, 'clone env name');

    setIsRequesting(true);
    cloneEnvironment(envId, name)
      .then((env) => {
        // console.log(r, 'r...... update env');
        setTimeout(() => platformContext.app.modals.close());
        openTab(env, { id: env.__ref.id, type: ETabEntityTypes.Environment });
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
          Clone Environment
        </div>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <div className="p-4">
          <div className="">
            <div className="items-center mb-4">
              <label
                className="text-appForeground text-sm block mb-1"
                htmlFor="envBane"
              >
                Collection Name
              </label>
              <label className="text-sm font-semibold leading-3 block text-appForegroundInActive w-full relative mb-2">
                {collection?.name}
              </label>
            </div>

            <div className="items-center mb-4">
              <label
                className="text-appForeground text-sm block mb-1"
                htmlFor="envBane"
              >
                Environment Name
              </label>
              <label className="text-sm font-semibold leading-3 block text-appForegroundInActive w-full relative mb-2">
                {env.name}
              </label>
            </div>

            <Input
              autoFocus={true}
              label="Enter New Name For Cloned Environment"
              placeholder="new name for cloned environment"
              name={'name'}
              value={name}
              onChange={onChangeName}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={error.name}
              // iconPosition="right"
              // icon={<VscEdit />}
            />
          </div>

          {/* <div className="">
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
          </div> */}

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
              onChange={() => {}}
              readOnly={true}
              disabled={true}
              height={'280px'}
              monacoOptions={{
                extraEditorClassName: `border border-inputBorder rounded-sm p-2 leading-5 
                  outline-none placeholder-inputPlaceholder 
                  text-base focus:bg-inputFocusBackground w-full
                  bg-inputBackground`,
                fontSize: '14px',
                height: '250px',
                wordWrap: 'off',
                readOnly: true,
              }}
              className="!h-80"
            />
          </div>
        </div>
        <div className="p-4">
          <TabHeader className="!p-0">
            <TabHeader.Right>
              <Button
                text="Cancel"
                onClick={(e) => onClose()}
                secondary
                transparent
                ghost
                sm
              />
              <Button
                text={isRequesting ? 'Cloning...' : 'Clone Environment'}
                onClick={onCreate}
                disabled={isRequesting}
                primary
                sm
              />
            </TabHeader.Right>
          </TabHeader>
        </div>
      </Modal.Body>
    </>
  );
};

export default CloneEnvironment;
