import { memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import {
  RootContainer,
  Container,
  Loader,
  TabHeader,
  ProgressBar,
  SecondaryTab,
} from '@firecamp/ui-kit';
import { _array, _auth, _object } from '@firecamp/utils';
import { ICollection, TPlainObject } from '@firecamp/types';
import {
  preScriptSnippets,
  postScriptSnippets,
} from '@firecamp/rest-executor/dist/esm/script-runner/snippets';
import { Rest } from '@firecamp/cloud-apis';
import EditInfo from '../../modals-v3/settings/shared/EditInfo';
import { EPlatformModalTypes } from '../../../types';
import Auth from '../../modals-v3/settings/shared/Auth';
import Scripts from '../../modals-v3/settings/shared/Scripts';

enum ETabTypes {
  Info = 'info',
  Auth = 'auth',
  PreRequest = 'pre-request',
  Tests = 'tests',
}

type TCollectionTabState = {
  originalCollection: ICollection;
  collection: ICollection;
  activeTab: ETabTypes;
  isFetchingCollection: boolean;
  isUpdatingCollection: boolean;
};

const CollectionTab = ({ tab, platformContext: context }) => {
  const entity: ICollection = _cloneDeep({ ...tab.entity });
  const collectionId = tab.__meta.entityId;
  if (!collectionId) return <></>; //TODO: close tab and show error message here

  const [state, setState] = useState<TCollectionTabState>({
    originalCollection: entity,
    collection: entity,
    activeTab: ETabTypes.Info,
    isFetchingCollection: false,
    isUpdatingCollection: false,
  });

  const {
    originalCollection,
    collection,
    activeTab,
    isFetchingCollection,
    isUpdatingCollection,
  } = state;

  const tabs = [
    { name: 'Collection Info', id: ETabTypes.Info },
    { name: 'Auth', id: ETabTypes.Auth },
    { name: 'Pre-Request', id: ETabTypes.PreRequest },
    { name: 'Tests', id: ETabTypes.Tests },
  ];

  useEffect(() => {
    const _fetchCollection = async () => {
      setState((s) => ({ ...s, isFetchingCollection: true }));
      // fetch collection
      await Rest.collection
        .fetch(collectionId)
        .then((d) => d?.data || {})
        .then((c) => {
          // _collection.auth = _auth.normalizeToUi(_collection?.auth || {});
          setState((s) => ({
            ...s,
            collection: c,
            originalCollection: c,
          }));
        })
        .catch((e) => {
          console.log({ e });
        })
        .finally(() => {
          setState((s) => ({ ...s, isFetchingCollection: false }));
        });
    };
    _fetchCollection();
  }, [collectionId]);

  const onChange = (key: string, value: any) => {
    if (['auth', '__meta', 'scripts'].includes(key)) {
      setState((s) => ({
        ...s,
        collection: {
          ...s.collection,
          [key]: {
            ...(s.collection?.[key] || {}),
            ...value,
          },
        },
      }));
    } else {
      setState((s) => ({
        ...s,
        collection: {
          ...s.collection,
          [key]: value,
        },
      }));
    }
  };

  const onUpdate = async (updates: TPlainObject) => {
    if (state.isFetchingCollection) return;

    // console.log({ updates });
    setState((s) => ({ ...s, isUpdatingCollection: true }));

    await Rest.collection
      .update(collectionId, updates)
      .then(() => {
        const collection = _object.mergeDeep(
          state.collection,
          updates
        ) as ICollection;
        setState((s) => ({
          ...s,
          originalCollection: collection,
          collection: collection,
        }));
      })
      .catch((e) => {
        console.log({ e });
      })
      .finally(() => {
        setState((s) => ({ ...s, isUpdatingCollection: false }));
      });
  };

  const renderTab = (
    collection: ICollection,
    tabId: string,
    isRequesting: boolean
  ) => {
    switch (tabId) {
      case 'info':
        return (
          <EditInfo
            type={EPlatformModalTypes.CollectionSetting}
            entity={collection}
            name={collection.name || ''}
            description={collection.description || ''}
            isRequesting={isRequesting}
            onChange={onChange}
            onUpdate={onUpdate}
          />
        );

      case 'auth':
        return (
          <Auth
            type={EPlatformModalTypes.CollectionSetting}
            entity={collection}
            onChange={onChange}
            onUpdate={onUpdate}
          />
        );

      case 'pre-request':
        return (
          <Scripts
            type={EPlatformModalTypes.CollectionSetting}
            entity={collection}
            scripts={[]}
            snippets={preScriptSnippets}
            isRequesting={isRequesting}
            onChange={onChange} // onChangeScript={(val) => console.log('preScripts', val)}
            onUpdate={onUpdate}
          />
        );
      case 'tests':
        return (
          <Scripts
            type={EPlatformModalTypes.CollectionSetting}
            entity={collection}
            scripts={[]}
            snippets={postScriptSnippets}
            isRequesting={isRequesting}
            onChange={onChange} // onChangeScript={(val) => console.log('preScripts', val)}
            onUpdate={onUpdate}
          />
        );

      default:
        return <></>;
    }
  };

  if (isFetchingCollection === true || isUpdatingCollection) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <ProgressBar active={isFetchingCollection || isUpdatingCollection} />
        <Container className="with-divider">
          <Container.Header>
            <TabHeader className="height-ex-small bg-statusBarBackground2 !pl-3 !pr-3">
              <TabHeader.Left>
                <div className="user-select flex text-base font-semibold">
                  {originalCollection.name}
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
              onSelect={(tabId: ETabTypes) => {
                setState((s) => ({ ...s, activeTab: tabId }));
              }}
            />
            {renderTab(collection, activeTab, isUpdatingCollection)}

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
