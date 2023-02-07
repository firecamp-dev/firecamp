import { memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import {
  RootContainer,
  Container,
  Column,
  Row,
  Loader,
  TabHeader,
  ProgressBar,
  SecondaryTab,
} from '@firecamp/ui-kit';
import { _array, _auth, _object } from '@firecamp/utils';
import { EAuthTypes } from '@firecamp/types';
import {
  preScriptSnippets,
  postScriptSnippets,
} from '@firecamp/rest-executor/dist/esm/script-runner/snippets';
import { ICollectionSettingUi } from '../../modals-v3/settings/types';
import { Rest } from '@firecamp/cloud-apis';
import EditInfo from '../../modals-v3/settings/shared/EditInfo';
import { EPlatformModalTypes } from '../../../types';
import Auth from '../../modals-v3/settings/shared/Auth';
import Scripts from '../../modals-v3/settings/shared/Scripts';

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
  PreRequest = 'pre-request',
  Tests = 'tests',
}

const CollectionTab = ({ tab, platformContext: context }) => {
  const _collection = _cloneDeep({ ...defaultCollection, ...tab.entity });
  const collectionId = tab.__meta.entityId;

  console.log(collectionId, tab);

  const [collection, setCollection] = useState(_collection);
  const [initialCollection, setInitialCollection] = useState(_collection);
  const [isRequesting, setIsRequesting] = useState(false);

  const tabs = [
    { name: 'Collection Info', id: ETabTypes.Edit },
    { name: 'Auth', id: ETabTypes.Auth },
    // { name: 'Script', id: ETabTypes.Script },
    { name: 'Pre-Request', id: ETabTypes.PreRequest },
    { name: 'Tests', id: ETabTypes.Tests },
  ];

  const [activeTab, setActiveTab] = useState<ETabTypes>(ETabTypes.Edit);

  useEffect(() => {
    const _fetchCollection = async () => {
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
            close={() => {}}
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
            close={() => {}}
            onUpdate={onUpdate}
          />
        );

      case 'pre-request':
        return (
          <Scripts
            type={EPlatformModalTypes.CollectionSetting}
            initialPayload={initialCollection}
            scripts={''}
            snippets={preScriptSnippets}
            isRequesting={isRequesting}
            // onChange={onChange}
            // onChangeScript={(val) => console.log('preScripts', val)}
            onUpdate={onUpdate}
          />
        );
      case 'tests':
        return (
          <Scripts
            type={EPlatformModalTypes.CollectionSetting}
            initialPayload={initialCollection}
            scripts={''}
            snippets={postScriptSnippets}
            isRequesting={isRequesting}
            // onChange={onChange}
            // onChangeScript={(val) => console.log('preScripts', val)}
            onUpdate={onUpdate}
          />
        );

      default:
        return <></>;
    }
  };

  if (isRequesting === true) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <ProgressBar active={isRequesting} />
        <Container className="with-divider">
          <Container.Header>
            <TabHeader className="height-ex-small bg-statusBarBackground2 !pl-3 !pr-3">
              <TabHeader.Left>
                <div className="user-select flex text-base font-semibold">
                  {collection.name}
                </div>
                {/* <VscEdit size={12} onClick={rename} className="pointer" /> */}
              </TabHeader.Left>
            </TabHeader>
          </Container.Header>

          <Container.Body className="flex flex-col">
            <SecondaryTab
              className="flex items-center p-4 w-full pb-0"
              list={tabs}
              activeTab={activeTab}
              onSelect={(tabId: ETabTypes) => setActiveTab(tabId)}
            />
            {renderTab(activeTab)}

            {/* <Row flex={1} overflow="auto" className="with-divider h-full">
              <Column></Column>
            </Row> */}
          </Container.Body>
        </Container>
      </Container>
    </RootContainer>
  );
};

export default memo(CollectionTab, (p, n) => !isEqual(p, n));
