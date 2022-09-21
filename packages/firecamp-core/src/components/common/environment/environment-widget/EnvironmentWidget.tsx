import { useState, useEffect, FC } from 'react';
import { Button, EButtonSize } from '@firecamp/ui-kit';
// import { VscEye } from '@react-icons/all-files/vsc/VscEye';
import shallow from 'zustand/shallow';
import { EEnvironmentScope, TId } from '@firecamp/types';

import EnvironmentDD from './EnvironmentDD';
import Constants from './Constants';

import { IEnvironmentStore, useEnvStore } from '../../../../store/environment';
import { IUserStore, useUserStore } from '../../../../store/user';

// import { useTabStore } from '../../../../store/tab';

export const CONSTS = Constants;

const EnvironmentWidget: FC<IEnvironmentWidget> = ({
  previewId = '',
  collectionId = '',
  workspaceActiveEnv = '',
  collectionActiveEnv = '',
  onWorkspaceActiveEnvChange = (envId: TId) => {},
  onCollectionActiveEnvChange = (collection_id: TId, envId: TId) => {},
}) => {
  let {
    wEnvs,
    cEnvs,
    setWorkspaceActiveEnv,
    setCollectionActiveEnv,

    toggleEnvSidebar,
  } = useEnvStore(
    (s: IEnvironmentStore) => ({
      wEnvs: s.envs.filter((e) => e.meta.type == EEnvironmentScope.Workspace),
      cEnvs: s.envs.filter((e) => e._meta.collection_id == collectionId),
      // wEnvs: Object.values(s.environments.workspace || {}),
      // cEnvs: Object.values(s.environments?.[collectionId] || {}),
      setWorkspaceActiveEnv: s.setWorkspaceActiveEnv,
      setCollectionActiveEnv: s.setCollectionActiveEnv,

      toggleEnvSidebar: s.toggleEnvSidebar,
    }),
    shallow
  );

  let { isGuest } = useUserStore((s: IUserStore) => ({
    isGuest: s.isGuest,
  }));

  /*  let { activeTab } = useTabStore((s) => ({
    activeTab: s.activeTab,
  })); */

  /*  let collectionActiveEnv = useMemo(
    () => getCollectionActiveEnv(collectionId),          
    [activeTab, collectionId]
  ); */

  let [showCreateEnvButton, toggleShowCreateEnvButton] = useState(false);

  // let wEnvs = getWorkspaceEnvs();
  // let cEnvs = useMemo(() => getCollectionEnvs(collectionId), [collectionId]);

  // console.log({ cEnvs, collectionId });

  /**
   * Show create environmrnt button if no collection and workspace environments found
   */
  useEffect(() => {
    if (isGuest === true) return;
    if (!wEnvs?.length && !cEnvs?.length && showCreateEnvButton === false) {
      toggleShowCreateEnvButton(true);
    } else if (
      (wEnvs?.length || cEnvs?.length) &&
      showCreateEnvButton === true
    ) {
      toggleShowCreateEnvButton(false);
    }
  }, [collectionId, wEnvs, cEnvs, previewId]);

  useEffect(() => {
    if (isGuest === true) return;

    // let updatedPrjActiveEnv =
    //   preferenceStore?.getState()?.[
    //   Preferences.Name.PROJECT_ACTIVE_ENVIRONMENT
    //   ]?.[collectionId] ||
    //   envVariableProvider.getDefaultEnvironment(collectionId);
    // if (updatedPrjActiveEnv !== collectionActiveEnv) {
    //   setCollectionActiveEnv(collectionId, updatedPrjActiveEnv);
    // }
  }, [collectionId]);

  /*   useEffect(() => {
    setWorkspaceActiveEnv(workspaceActiveEnv);
    onWorkspaceActiveEnvChange(workspaceActiveEnv);   
  }, [workspaceActiveEnv]); */

  /*  useEffect(() => {
    setCollectionActiveEnv(collectionId, collectionActiveEnv);
    onCollectionActiveEnvChange(collectionId, collectionActiveEnv);
  }, [collectionActiveEnv]); */

  let _openWrsModal = () => {
    // F.ModalService.open(
    //   EModals.WORKSPACE_SETTING,
    //   EWorkspaceSettingTabs.ENVIRONMENT,
    //   { isAddEnvPopoverOpen: true }
    // );
  };

  let _setWrsActiveEnv = (envId: TId) => {
    setWorkspaceActiveEnv(envId);
    onWorkspaceActiveEnvChange(envId);
  };

  let _setCollectionActiveEnv = (envId: TId) => {
    // console.log({ envId });

    setCollectionActiveEnv(collectionId, envId);
    onCollectionActiveEnvChange(collectionId, envId);
  };

  if (isGuest === true) return <></>;

  return (
    <div className="!ml-auto !mr-1 w-fit flex items-center">
      {showCreateEnvButton
        ? [
            'No Environments',
            <Button
              key={`add-environment-button-${previewId}`}
              text={'Create New Environment'}
              primary
              transparent={true}
              xs
              onClick={_openWrsModal}
              className="ml-2 leading-4"
            />,
          ]
        : [
            <EnvironmentDD
              key={`global-env-dd-${previewId}`}
              activeEnv={workspaceActiveEnv}
              environments={wEnvs}
              // envVariableProvider={envVariableProvider}
              onChange={_setWrsActiveEnv}
              scope={EEnvironmentScope.Workspace}
            />,
            collectionId && collectionId.length ? (
              <EnvironmentDD
                key={`collection-env-dd-${previewId}`}
                activeEnv={collectionActiveEnv}
                environments={cEnvs}
                collectionId={collectionId}
                onChange={_setCollectionActiveEnv}
                scope={EEnvironmentScope.Collection}
              />
            ) : (
              ''
            ),
            <span
              key={'toggle-env-button'}
              className="iconv2-eye-icon cursor-pointer ml-1 text-base"
              onClick={() => toggleEnvSidebar()}
            />,
          ]}
    </div>
  );
};

export default EnvironmentWidget;

/**
 * Environment variable card
 * Update active environment for workspace and collection
 * Update environment variables for workspace and collection
 * View environment variables for workspace and collection
 */
export interface IEnvironmentWidget {
  /**
   * Environment preview unique identification
   */
  previewId: string;
  /**
   * Environment's parent collection id
   */
  collectionId?: TId;

  workspaceActiveEnv: TId;
  collectionActiveEnv: TId;
  /**
   * Update action and payload
   */
  //TODO: add and import interface from zustand store
  onChange: ({ action: string, payload: object }) => void;

  // callback fn to return updated workspace active env to parent component
  onWorkspaceActiveEnvChange: (envId: TId) => void;

  // callback fn to return updated collection active env to parent component
  onCollectionActiveEnvChange: (collection_id: TId, envId: TId) => void;
}
