import { memo, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import {
  RootContainer,
  Container,
  Loader,
  TabHeader,
  ProgressBar,
  SecondaryTab,
  Row
} from '@firecamp/ui-kit';
import { _array, _auth, _object } from '@firecamp/utils';
import { ICollection, IFolder } from '@firecamp/types';
import {
  preScriptSnippets,
  postScriptSnippets,
} from '@firecamp/rest-executor/dist/esm/script-runner/snippets';
import { Rest } from '@firecamp/cloud-apis';
import EditInfo from './tabs/EditInfo';
import Auth from './tabs/Auth';
import Scripts from './tabs/Scripts';

type TEntity = ICollection | IFolder;
enum ETabTypes {
  Info = 'info',
  Auth = 'auth',
  PreRequest = 'pre-request',
  Tests = 'tests',
}

type TState = {
  originalEntity: TEntity;
  entity: TEntity;
  activeTab: ETabTypes;
  isFetchingEntity: boolean;
  isUpdatingEntity: boolean;
};

const CollectionFolderEntityTab = ({ tab, platformContext: context }) => {
  const _entity: TEntity = _cloneDeep({ ...tab.entity });
  const entityType = tab.__meta.entityType;
  const entityId = tab.__meta.entityId;
  if (!entityId) return <></>; //TODO: close tab and show error message here
  if (!['collection', 'folder'].includes(entityType)) return <></>;

  const [state, setState] = useState<TState>({
    originalEntity: _entity,
    entity: _entity,
    activeTab: ETabTypes.Info,
    isFetchingEntity: false,
    isUpdatingEntity: false,
  });

  const {
    originalEntity: _oEntity,
    entity,
    activeTab,
    isFetchingEntity,
    isUpdatingEntity,
  } = state;

  const tabs = [
    {
      name: entityType == 'collection' ? 'Collection Info' : 'Folder Info',
      id: ETabTypes.Info,
    },
    { name: 'Auth', id: ETabTypes.Auth },
    { name: 'Pre-Request', id: ETabTypes.PreRequest },
    { name: 'Tests', id: ETabTypes.Tests },
  ];

  useEffect(() => {
    const _fetchCollection = async () => {
      setState((s) => ({ ...s, isFetchingEntity: true }));
      // fetch collection/folder
      await Rest[entityType]
        .fetch(entityId)
        .then((d) => d?.data || {})
        .then((c) => {
          // _collection.auth = _auth.normalizeToUi(_collection?.auth || {});
          setState((s) => ({
            ...s,
            entity: c,
            originalEntity: c,
          }));
        })
        .catch((e) => {
          console.log({ e });
        })
        .finally(() => {
          setState((s) => ({ ...s, isFetchingEntity: false }));
        });
    };
    _fetchCollection();
  }, [entityId, entityType]);

  const onChange = (key: string, value: any) => {
    if (['auth', '__meta'].includes(key)) {
      setState((s) => ({
        ...s,
        entity: {
          ...s.entity,
          [key]: {
            ...(s.entity?.[key] || {}),
            ...value,
          },
        },
      }));
    } else {
      setState((s) => ({
        ...s,
        entity: {
          ...s.entity,
          [key]: value,
        },
      }));
    }
  };

  const onUpdate = async (updates: Partial<ICollection | IFolder>) => {
    if (state.isFetchingEntity) return;
    // console.log({ updates });
    setState((s) => ({ ...s, isUpdatingEntity: true }));

    await Rest[entityType]
      .update(entityId, updates)
      .then(() => {
        const entity = _object.mergeDeep(
          state.originalEntity,
          updates
        ) as TEntity;
        setState((s) => ({
          ...s,
          originalEntity: entity,
          entity,
        }));
      })
      .catch((e) => {
        console.log({ e });
      })
      .finally(() => {
        setState((s) => ({ ...s, isUpdatingEntity: false }));
      });
  };

  const renderTab = (entity: TEntity, tabId: string, isRequesting: boolean) => {
    switch (tabId) {
      case 'info':
        return (
          <EditInfo
            entityType={entityType}
            entity={entity}
            isRequesting={isRequesting}
            isNameChanged={
              !isEqual({ name: entity.name }, { name: _oEntity.name })
            }
            isDescriptionChanged={
              !isEqual(
                { description: entity.description },
                { description: _oEntity.description }
              )
            }
            onChange={onChange}
            onUpdate={onUpdate}
          />
        );

      case 'auth':
        return (
          <Auth
            entityType={entityType}
            entity={entity}
            onChange={onChange}
            onUpdate={onUpdate}
          />
        );

      case 'pre-request':
        return (
          <div className="m-6 border border-appBorder w-full flex-1 overflow-hidden">
          <Scripts
            entity={entity}
            scripts={entity.preScripts}
            snippets={preScriptSnippets}
            isRequesting={isRequesting}
            isScriptChanged={!isEqual(_oEntity.preScripts, entity.preScripts)}
            onChange={(preScripts) => onChange('preScripts', preScripts)}
            onUpdate={(preScripts) => onUpdate({ preScripts: preScripts })}
          />
          </div>
        );
      case 'tests':
        return (
          <div className="m-6 border border-appBorder flex-1 overflow-hidden">
          <Scripts
            entity={entity}
            scripts={entity.postScripts}
            snippets={postScriptSnippets}
            isRequesting={isRequesting}
            isScriptChanged={!isEqual(_oEntity.postScripts, entity.postScripts)}
            onChange={(postScripts) => onChange('postScripts', postScripts)}
            onUpdate={(postScripts) => onUpdate({ postScripts: postScripts })}
          />
          </div>
        );

      default:
        return <></>;
    }
  };

  if (isFetchingEntity === true) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <ProgressBar active={isFetchingEntity || isUpdatingEntity} />
        <Container className="with-divider">
          <Container.Header>
            <TabHeader className="height-ex-small bg-statusBarBackground2 !pl-3 !pr-3">
              <TabHeader.Left>
                <div className="user-select flex text-base font-semibold">
                  {_oEntity.name}
                </div>
                {/* <VscEdit size={12} onClick={rename} className="pointer" /> */}
              </TabHeader.Left>
            </TabHeader>
          </Container.Header>
          <Container.Body className="flex flex-col">
            <SecondaryTab
              className="flex items-center px-4 pt-5 w-full pb-0"
              list={tabs}
              activeTab={activeTab}
              onSelect={(tabId: ETabTypes) => {
                setState((s) => ({ ...s, activeTab: tabId }));
              }}
            />

            <Row flex={1} overflow="auto" className="with-divider h-full">
             
            {renderTab(entity, activeTab, isUpdatingEntity)}
            </Row>
          </Container.Body>
        </Container>
      </Container>
    </RootContainer>
  );
};
export default memo(CollectionFolderEntityTab, (p, n) => !isEqual(p, n));
