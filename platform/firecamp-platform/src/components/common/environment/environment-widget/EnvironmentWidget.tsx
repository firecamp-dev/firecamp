import { useState, useEffect, FC } from 'react';
import { Button } from '@firecamp/ui-kit';
// import { VscEye } from '@react-icons/all-files/vsc/VscEye';
import shallow from 'zustand/shallow';
import { EEnvironmentScope, TId } from '@firecamp/types';
import EnvironmentDD from './EnvironmentDD';
import { IEnvironmentStore, useEnvStore } from '../../../../store/environment';
import { IUserStore, useUserStore } from '../../../../store/user';

const EnvironmentWidget: FC<IEnvironmentWidget> = ({
  previewId = '',
  collectionId = '',
  collectionActiveEnv = '',
  onCollectionActiveEnvChange = (collectionId: TId, envId: TId) => {},
}) => {
  const { cEnvs, setCollectionActiveEnv, toggleEnvSidebar } = useEnvStore(
    (s: IEnvironmentStore) => ({
      cEnvs: s.envs.filter((e) => e.__ref.collectionId == collectionId),
      setCollectionActiveEnv: s.setCollectionActiveEnv,
      toggleEnvSidebar: s.toggleEnvSidebar,
    }),
    shallow
  );

  console.log(cEnvs, 4445445)

  const { isGuest } = useUserStore((s: IUserStore) => ({
    isGuest: s.isGuest,
  }));

  const [showCreateEnvButton, toggleShowCreateEnvButton] = useState(false);

  /** show create environmrnt button if no collection and workspace environments found */
  useEffect(() => {
    if (isGuest === true) return;
    if (!cEnvs?.length && showCreateEnvButton === false) {
      toggleShowCreateEnvButton(true);
    } else if (cEnvs?.length && showCreateEnvButton === true) {
      toggleShowCreateEnvButton(false);
    }
  }, [collectionId, cEnvs, previewId]);

  useEffect(() => {
    if (isGuest === true) return;
  }, [collectionId]);

  const _openWrsModal = () => {};

  const _setCollectionActiveEnv = (envId: TId) => {
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
              className="ml-2 leading-4"
              onClick={_openWrsModal}
              primary
              transparent
              xs
            />,
          ]
        : [
            // <EnvironmentDD
            //   key={`global-env-dd-${previewId}`}
            //   activeEnv={workspaceActiveEnv}
            //   environments={wEnvs}
            //   // envVariableProvider={envVariableProvider}
            //   onChange={_setWrsActiveEnv}
            //   scope={EEnvironmentScope.Workspace}
            // />,
            collectionId ? (
              <>
                <EnvironmentDD
                  key={`collection-env-dd-${previewId}`}
                  activeEnv={collectionActiveEnv}
                  environments={cEnvs}
                  collectionId={collectionId}
                  onChange={_setCollectionActiveEnv}
                  scope={EEnvironmentScope.Collection}
                />
                <span
                  key={'toggle-env-button'}
                  className="cursor-pointer ml-1 text-base"
                  onClick={() => toggleEnvSidebar()}
                />
              </>
            ) : (
              <></>
            ),
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
  collectionActiveEnv: TId;

  /** callback fn to return updated collection active env to parent component */
  onCollectionActiveEnvChange: (collectionId: TId, envId: TId) => void;
}
