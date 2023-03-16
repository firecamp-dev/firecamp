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
  Row,
} from '@firecamp/ui';
import { _array, _auth, _env, _object } from '@firecamp/utils';
import { EAuthTypes, IAuth, ICollection, IFolder } from '@firecamp/types';
import {
  preScriptSnippets,
  testScriptSnippets,
} from '@firecamp/rest-executor/dist/esm/script-runner/snippets';
import { Rest } from '@firecamp/cloud-apis';
import EditInfo from './tabs/EditInfo';
import Scripts from './tabs/Scripts';
import Variables from './tabs/Variables';
import { useEnvStore } from '../../../store/environment';
import AuthTab from './tabs/AuthTab';

type TEntity = ICollection | IFolder;
enum ETabTypes {
  Info = 'info',
  Auth = 'auth',
  PreRequest = 'pre-request',
  Tests = 'tests',
  Variables = 'variables',
}

type TState = {
  originalEntity: TEntity;
  entity: TEntity;
  activeTab: ETabTypes;
  isFetchingEntity: boolean;
  isUpdatingEntity: boolean;
  activeAuthType: EAuthTypes;
  runtimeAuth: any;
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
    activeAuthType: EAuthTypes.None,
    runtimeAuth: _cloneDeep(_auth.defaultAuthState),
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
  if (entityType == 'collection') {
    tabs.push({ name: 'Variables', id: ETabTypes.Variables });
  }

  useEffect(() => {
    const _fetchCollection = async () => {
      setState((s) => ({ ...s, isFetchingEntity: true }));
      // fetch collection/folder
      await Rest[entityType]
        .fetch(entityId)
        .then((d) => d?.data || {})
        .then((c) => {
          // _collection.auth = _auth.normalizeToUi(_collection?.auth || {});
          const originalEnv = _env.prepareRuntimeEnvFromRemoteEnv({
            name: '',
            variables: c.variables || [],
            __ref: { id: c.__ref.id },
          });
          // assign runtime variables to replace remote variables
          c.variables = originalEnv.variables;
          if (!c.auth) c.auth = { type: EAuthTypes.None, value: '' };
          setState((s) => ({
            ...s,
            entity: c,
            originalEntity: c,
            activeAuthType: c.auth?.type || EAuthTypes.None,
            runtimeAuth: { ...s.runtimeAuth, [c.auth.type]: c.auth.value },
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
    if (['__meta'].includes(key)) {
      //TODO: check there, I think it's not needed
      setState((s) => {
        let _s = {
          ...s,
          entity: {
            ...s.entity,
            [key]: {
              ...(s.entity?.[key] || {}),
              ...value,
            },
          },
        };
        return _s;
      });
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

  const changeAuth = (
    type: EAuthTypes,
    changes: { key: string; value: any }
  ) => {
    const { key, value } = changes;
    const auth: IAuth = {
      type,
      value: '',
    };

    console.log(auth, type, changes);

    setState((s) => {
      // for auth type oauth2 whole auth payload will be there in updates instead update key value pair
      if (type === EAuthTypes.OAuth2) {
        //@ts-ignore
        auth.value = { ...changes };
      } else {
        auth.value = {
          ...s.entity.auth.value,
          [key]: value,
        } as IAuth['value'];
      }

      return {
        ...s,
        entity: {
          ...s.entity,
          auth,
        },
        runtimeAuth: {
          ...s.runtimeAuth,
          [auth.type]: auth.value,
        },
      };
    });

    // state.resetAuthHeaders(auth.type);
    // state.equalityChecker({ auth });
  };

  const changeAuthType = (type: EAuthTypes) => {
    setState((s) => ({
      ...s,
      activeAuthType: type,
      entity: {
        ...s.entity,
        auth: { type, value: s.runtimeAuth[type] },
      },
    }));
  };

  const onUpdate = async (updates: Partial<ICollection | IFolder>) => {
    if (state.isFetchingEntity) return;
    console.log({ updates });
    setState((s) => ({ ...s, isUpdatingEntity: true }));

    /**
     * The update variables are runtime variable (initial/current(value) key format),
     * we need to convert them in local and remote variable before updating it
     */
    //@ts-ignore
    if (updates.variables) {
      const { localEnv, remoteEnv } = _env.splitEnvs({
        name: '',
        //@ts-ignore
        variables: updates.variables,
        __ref: { id: '' },
      });
      const { setLocalEnv } = useEnvStore.getState();
      setLocalEnv({
        ...localEnv,
        __ref: { id: entity.__ref.id },
      });

      //@ts-ignore
      updates.variables = _cloneDeep(remoteEnv.variables);
    }

    await Rest[entityType]
      .update(entityId, updates)
      .then(() => {
        const entity = _object.mergeDeep(state.originalEntity, {
          ...updates,
          variables: _env.prepareRuntimeEnvFromRemoteEnv({
            name: '',
            //@ts-ignore
            variables: updates.variables || [],
            __ref: { id: entityId },
          }).variables,
        }) as TEntity;
        setState((s) => ({
          ...s,
          originalEntity: entity,
          entity,
        }));

        context.app.notify.success(
          `The ${entityType} has been saved successfully!`
        );
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
      case ETabTypes.Info:
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

      case ETabTypes.Auth:
        return (
          <AuthTab
            type={state.activeAuthType}
            value={state.runtimeAuth[state.activeAuthType]}
            isRequesting={isRequesting}
            isAuthChanged={!isEqual(_oEntity.auth, entity.auth)}
            onChangeAuth={changeAuth}
            onChangeAuthType={changeAuthType}
            onUpdate={() => {
              onUpdate({ auth: state.entity.auth });
            }}
          />
        );

      case ETabTypes.PreRequest:
        return (
          <Scripts
            entity={entity}
            scripts={entity.preScripts}
            snippets={preScriptSnippets}
            isRequesting={isRequesting}
            isScriptChanged={!isEqual(_oEntity.preScripts, entity.preScripts)}
            onChange={(preScripts) => onChange('preScripts', preScripts)}
            onUpdate={(preScripts) => onUpdate({ preScripts: preScripts })}
          />
        );
      case ETabTypes.Tests:
        return (
          <Scripts
            entity={entity}
            scripts={entity.postScripts}
            snippets={testScriptSnippets}
            isRequesting={isRequesting}
            isScriptChanged={!isEqual(_oEntity.postScripts, entity.postScripts)}
            onChange={(postScripts) => onChange('postScripts', postScripts)}
            onUpdate={(postScripts) => onUpdate({ postScripts: postScripts })}
          />
        );

      case ETabTypes.Variables:
        return (
          <Variables
            entity={entity as ICollection}
            isRequesting={isRequesting}
            //@ts-ignore
            isVarsChanged={!isEqual(_oEntity.variables, entity.variables)}
            onChange={(vars) => onChange('variables', vars)}
            onUpdate={(vars) => onUpdate({ variables: vars })}
          />
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
              <div className="m-6 border border-appBorder flex-1 overflow-hidden">
                {renderTab(entity, activeTab, isUpdatingEntity)}
              </div>
            </Row>
          </Container.Body>
        </Container>
      </Container>
    </RootContainer>
  );
};
export default memo(CollectionFolderEntityTab, (p, n) => !isEqual(p, n));
