import { FC, useMemo } from 'react';
import shallow from 'zustand/shallow';
import { Button, Column } from '@firecamp/ui-kit';
import { TId } from '@firecamp/types';

import EnvironmentDD from './EnvironmentDD';
import { IEnvironmentStore, useEnvStore } from '../../../../store/environment';
import { IUserStore, useUserStore } from '../../../../store/user';
import { ITabStore, useTabStore } from '../../../../store/tab';

const EnvironmentSelecctor: FC<any> = ({
  onCollectionActiveEnvChange = (colId: TId, envId: TId) => {},
}) => {
  const {
    tabColMap,
    colEnvMap,
    getCollectionEnvs,
    setCollectionActiveEnv,
    toggleEnvSidebar,
  } = useEnvStore(
    (s: IEnvironmentStore) => ({
      tabColMap: s.tabColMap,
      colEnvMap: s.colEnvMap,
      getCollectionEnvs: s.getCollectionEnvs,
      setCollectionActiveEnv: s.setCollectionActiveEnv,
      toggleEnvSidebar: s.toggleEnvSidebar,
    }),
    shallow
  );
  const { activeTab } = useTabStore(
    (s: ITabStore) => ({
      activeTab: s.activeTab,
    }),
    shallow
  );
  const { isGuest } = useUserStore(
    (s: IUserStore) => ({
      isGuest: s.isGuest,
    }),
    shallow
  );

  const { envId, envs, colId } = useMemo(() => {
    const colId = tabColMap[activeTab];
    const envs = !colId ? [] : getCollectionEnvs(colId);
    const envId = colEnvMap[colId];
    return { envs, envId, colId };
  }, [activeTab]);

  console.log(envId, envs, colId, colEnvMap, 4445445);

  const _setCollectionActiveEnv = (envId: TId) => {
    // setCollectionActiveEnv(collectionId, envId);
    // onCollectionActiveEnvChange(collectionId, envId);
  };

  if (isGuest === true) return <></>;
  return (
    <Column className="fc-tab-header-right  border-b border-tabBorder ml-auto flex-none bg-transparent w-36 flex items-center justify-end pr-1">
      <div className="!ml-auto !mr-1 w-fit flex items-center">
        <EnvironmentDD
          key={`collection-env-selector`}
          activeEnvId={envId}
          environments={envs}
          onChange={_setCollectionActiveEnv}
        />
        <span
          key={'toggle-env-button'}
          className="cursor-pointer ml-1 text-base"
          onClick={() => toggleEnvSidebar()}
        />
      </div>
    </Column>
  );
};
export default EnvironmentSelecctor;
