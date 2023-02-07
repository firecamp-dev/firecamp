import { FC, useEffect, useState } from 'react';
import {
  Container,
  Modal,
  IModal,
  SecondaryTab,
  ProgressBar,
} from '@firecamp/ui-kit';
import { _auth, _misc, _object } from '@firecamp/utils';
import _cloneDeep from 'lodash/cloneDeep';
import { EAuthTypes, TId } from '@firecamp/types';
import { Rest } from '@firecamp/cloud-apis';
// import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
// import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';

import { useModalStore } from '../../../store/modal';
import Auth from '../settings/shared/Auth';
import Scripts from '../settings/shared/Scripts';
import EditInfo from '../settings/shared/EditInfo';
import { ICollectionSettingUi } from '../settings/types';

import { EPlatformModalTypes } from '../../../types';

export const defaultCollection: ICollectionSettingUi = {
  name: '',
  description: '',
  scripts: {
    pre: '',
    post: '',
    test: '',
  },
  auth: {},
  __meta: { activeAuthType: EAuthTypes.None },
  __ref: { id: '', workspaceId: '' },
};

enum ETabTypes {
  Edit = 'edit',
  Auth = 'auth',
  Script = 'script',
}

type TModalMeta = {
  collectionId: TId;
};

const CollectionSetting: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const { collectionId } = useModalStore.getState().__meta as TModalMeta;

  const [collection, setCollection] = useState(defaultCollection);
  const [initialCollection, setInitialCollection] = useState(defaultCollection);
  const [isRequesting, setIsRequesting] = useState(false);

  const tabs = [
    { name: 'Edit', id: ETabTypes.Edit },
    { name: 'Auth', id: ETabTypes.Auth },
    { name: 'Script', id: ETabTypes.Script },
  ];

  const [activeTab, setActiveTab] = useState<ETabTypes>(ETabTypes.Edit);

  useEffect(() => {
    let _fetchCollection = async () => {
      setIsRequesting(true);
      try {
        // Fetch collection
        let fetchedCollection = await Rest.collection
          .fetch(collectionId)
          .then((d) => d?.data || {})
          .catch((e) => {});
        // console.log({ fetchedCollection });

        fetchedCollection.auth = _auth.normalizeToUi(
          fetchedCollection?.auth || {}
        );

        let collectionToSet = _object.mergeDeep(
          _cloneDeep(defaultCollection),
          fetchedCollection
        ) as ICollectionSettingUi;

        setCollection(collectionToSet);
        setInitialCollection(collectionToSet);
      } catch (error) {
        console.log({ error });
      }
      setIsRequesting(false);
    };

    _fetchCollection();
  }, [collectionId]);

  // console.log({ collection });

  const onChange = (key: string, value: any) => {
    if (['auth', 'meta', 'scripts'].includes(key)) {
      setCollection((c) => {
        return {
          ...c,
          [key]: {
            ...(c?.[key] || {}),
            ...value,
          },
        };
      });
    } else {
      setCollection((c) => ({ ...c, [key]: value }));
    }
  };

  const onUpdate = async (updates: { [key: string]: string }) => {
    if (isRequesting) return;

    // console.log({ updates });
    setIsRequesting(true);
    try {
      await Rest.collection.update(collectionId, updates);
      let updatedCollection = _object.mergeDeep(
        collection,
        updates
      ) as ICollectionSettingUi;

      setInitialCollection(updatedCollection);
    } catch (error) {
      console.log({ error });
    }

    setIsRequesting(false);
  };

  const renderTab = (tabId: string) => {
    switch (tabId) {
      case 'edit':
        return (
          <EditInfo
            type={EPlatformModalTypes.CollectionSetting}
            initialPayload={initialCollection}
            name={collection.name || ''}
            description={collection.description || ''}
            isRequesting={isRequesting}
            onChange={onChange}
            close={onClose}
            onUpdate={onUpdate}
          />
        );

      case 'auth':
        return (
          <Auth
            type={EPlatformModalTypes.CollectionSetting}
            initialPayload={initialCollection}
            auth={collection.auth}
            activeAuthType={collection.__meta.activeAuthType}
            onChange={onChange}
            close={onClose}
            onUpdate={onUpdate}
          />
        );

      case 'script':
        return (
          <Scripts
            type={EPlatformModalTypes.CollectionSetting}
            initialPayload={initialCollection}
            scripts={collection.scripts}
            isRequesting={isRequesting}
            onChange={onChange}
            close={onClose}
            onUpdate={onUpdate}
          />
        );

      default:
        return <></>;
    }
  };

  // console.log({ collection });

  return (
    <>
      <Modal.Header className="with-divider">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium">
          Collection Management
        </div>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <Container className="with-divider">
          <Container.Body className="flex flex-col">
            <SecondaryTab
              className="flex items-center p-4 w-full pb-0"
              list={tabs}
              activeTab={activeTab}
              onSelect={(tabId: ETabTypes) => setActiveTab(tabId)}
            />
            {renderTab(activeTab)}
          </Container.Body>
        </Container>
      </Modal.Body>
    </>
  );
};

export default CollectionSetting;
