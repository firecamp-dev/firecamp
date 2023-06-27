import { FC } from 'react';
import { ERequestTypes } from '@firecamp/types';
import { DropdownMenu } from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import { VscEllipsis } from '@react-icons/all-files/vsc/VscEllipsis';
import {
  FcIconGetSquare,
  FcIconGraphQL,
  FcIconSocketIoSquare,
  FcIconWebSocket,
} from '@firecamp/ui';
import getOs from '../../../services/get-os';
import { useTabStore } from '../../../store/tab';
import { ETabEntityTypes } from '../types';
let osName = getOs();

const Menu: FC = () => {
  const { open: openTab } = useTabStore.getState();
  const tabMenus = [
    {
      name: 'Create A Request',
      isLabel: true,
    },
    {
      name: 'Rest',
      prefix: () => (
        <div className={'dropdown-icon'}>
          <FcIconGetSquare className="text-rest" size={24} />
        </div>
      ),
      onClick: () => {
        openNewTab(ERequestTypes.Rest);
      },
    },
    {
      name: 'GraphQL',
      prefix: () => (
        <div className={'dropdown-icon'}>
          {<FcIconGraphQL className="text-graphql" size={24} />}
        </div>
      ),
      onClick: () => {
        openNewTab(ERequestTypes.GraphQL);
      },
    },
    {
      name: 'WebSocket',
      prefix: () => (
        <div className={'dropdown-icon'}>
          <FcIconWebSocket className="" size={24} />
        </div>
      ),
      onClick: () => {
        openNewTab(ERequestTypes.WebSocket);
      },
    },
    {
      name: 'SocketIO',
      prefix: () => (
        <div className={'dropdown-icon '}>
          <FcIconSocketIoSquare className="" size={24} />
        </div>
      ),
      onClick: () => {
        openNewTab(ERequestTypes.SocketIO);
      },
    },
  ];
  const openNewTab = (type) => {
    openTab({ __meta: { type } }, { id: '', type: ETabEntityTypes.Request });
  };

  return (
    <DropdownMenu
      handleRenderer={() => (
        <span className="w-9 h-full border-r border-tab-border bg-tab-background-activeColor flex items-center justify-center cursor-pointer">
          <VscEllipsis size={20} strokeWidth={1} />
        </span>
      )}
      width={200}
      options={tabMenus}
      onSelect={(v) => v.onClick()}
      classNames={{
        dropdown: '!pt-0 uppercase -ml-2 border-focusBorder',
        label: 'font-sans',
        item: '!text-sm !py-1 !leading-6',
      }}
      menuProps={{
        position: 'right',
      }}
    />
  );
};

export default Menu;
