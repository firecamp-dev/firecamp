import shallow from 'zustand/shallow';
import { Column } from '@firecamp/ui';
import { VscEye } from '@react-icons/all-files/vsc/VscEye';
import EnvironmentDD from './EnvironmentDD';
import { IEnvironmentStore, useEnvStore } from '../../../../store/environment';
import { IUserStore, useUserStore } from '../../../../store/user';

const EnvironmentSelector = () => {
  const { toggleEnvSidebar, setActiveEnv } = useEnvStore(
    (s: IEnvironmentStore) => ({
      toggleEnvSidebar: s.toggleEnvSidebar,
      setActiveEnv: s.setActiveEnv,
    }),
    shallow
  );
  const { isGuest } = useUserStore(
    (s: IUserStore) => ({
      isGuest: s.isGuest,
    }),
    shallow
  );

  if (isGuest === true) return <></>;
  return (
    <Column
      overflow="visible"
      className="fc-tab-header-right  border-b border-tabBorder flex-none bg-transparent w-36 flex items-center justify-end pr-1 border-l pl-1"
    >
      <div className="!ml-auto !mr-1 w-fit flex items-center">
        <EnvironmentDD
          key={`collection-env-selector`}
          onChange={(envId) => {
            setActiveEnv(envId);
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
