import shallow from 'zustand/shallow';
import { Button, Column } from '@firecamp/ui';
import { Table } from 'lucide-react';
import EnvironmentDD from './EnvironmentDD';
import { IEnvironmentStore, useEnvStore } from '../../../../store/environment';
import { IUserStore, useUserStore } from '../../../../store/user';
import platformContext from '../../../../services/platform-context';

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

  if (isGuest === true)
    return (
      <div className="flex items-center hover:bg-primaryColor">
        <Button
          text="Sign In"
          transparent
          primary
          classNames={{
            root: 'rounded-none border-0 border-tab-border border-b border-l  hover:text-secondaryColor-text',
          }}
          animate={false}
          onClick={() => platformContext.app.modals.openSignIn()}
        />
      </div>
    );
  return (
    <Column
      overflow="visible"
      className="fc-tab-header-right  border-b border-tab-border flex-none bg-transparent min-w-[9rem] w-fit flex items-center justify-end pr-1 border-l pl-1"
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
          <Table size={16} strokeWidth="1.5" strokeLinecap='square' strokeLinejoin='miter' />
        </span>
      </div>
    </Column>
  );
};
export default EnvironmentSelector;
