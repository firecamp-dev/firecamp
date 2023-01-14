import { useMemo } from 'react';
import shallow from 'zustand/shallow';
import { Column } from '@firecamp/ui-kit';
import { VscEye } from '@react-icons/all-files/vsc/VscEye';

import EnvironmentDD from './EnvironmentDD';
import { IEnvironmentStore, useEnvStore } from '../../../../store/environment';
import { IUserStore, useUserStore } from '../../../../store/user';
import { ITabStore, useTabStore } from '../../../../store/tab';

const EnvironmentSelector = () => {
  const {
    tabColMap,
    colEnvMap,
    getCollectionEnvs,
    setCurrentTabActiveEnv,
    toggleEnvSidebar,
  } = useEnvStore(
    (s: IEnvironmentStore) => ({
      tabColMap: s.tabColMap,
      colEnvMap: s.colEnvMap,
      getCollectionEnvs: s.getCollectionEnvs,
      setCurrentTabActiveEnv: s.setCurrentTabActiveEnv,
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
  }, [activeTab, colEnvMap]);

  // console.log(envId, envs, colId, colEnvMap, 4445445);

  if (isGuest === true) return <></>;
  if (!colId || !envId) return <></>;
  return (
    <Column
      overflow="visible"
      className="fc-tab-header-right  border-b border-tabBorder flex-none bg-transparent w-36 flex items-center justify-end pr-1 border-l pl-1"
    >
      <div className="!ml-auto !mr-1 w-fit flex items-center">
        <EnvironmentDD
          key={`collection-env-selector`}
          activeCollectionId={colId}
          activeEnvId={envId}
          environments={envs}
          onChange={(envId) => {
            setCurrentTabActiveEnv(envId);
          }}
        />
        <span
          key={'toggle-env-button'}
          className="cursor-pointer ml-1 text-base !text-info"
          onClick={() => toggleEnvSidebar()}
        >
          <VscEye size={14} />
        </span>
      </div>
    </Column>
  );
};
export default EnvironmentSelector;
