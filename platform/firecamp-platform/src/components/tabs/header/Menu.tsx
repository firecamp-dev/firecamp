import { FC } from 'react';
import { ERequestTypes } from '@firecamp/types';
import { Dropdown } from '@firecamp/ui';
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
      header: 'Create A Request',
      list: [
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
              <FcIconWebSocket className="text-websocket" size={24} />
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
              <FcIconSocketIoSquare className="text-socket" size={24} />
            </div>
          ),
          onClick: () => {
            openNewTab(ERequestTypes.SocketIO);
          },
        },
      ],
    },
    /*{
      header: 'Tab options ',
      list: [
        {
          name: 'Close All',
          postfix: () => (
            <div className="dropdown-text">
              {_misc.firecampAgent() === EFirecampAgent.Desktop ? (
                <span>
                  {osName && ['Windows', 'UNIX', 'Linux'].includes(osName)
                    ? `Ctrl + K + W`
                    : `⌘ + K + W`}
                </span>
              ) : (
                ''
              )}
            </div>
          ),
          onClick: (option, e) => {
            close.all();
          },
        },
        {
          name: 'Close saved',
          postfix: () => (
            <div className="dropdown-text">
              {_misc.firecampAgent() === EFirecampAgent.Desktop ? (
                <span>
                  {osName && ['Windows', 'UNIX', 'Linux'].includes(osName)
                    ? `Ctrl + K + U`
                    : `⌘ + K + U`}
                </span>
              ) : (
                ''
              )}
            </div>
          ),
          onClick: (option, e) => {
            close.allSaved();
          },
        },
        {   
                name: 'Close except active ',
                shortcut: {
                  command:
                    osName && ['Windows', 'UNIX', 'Linux'].includes(osName)
                      ? `Ctrl + /`
                      : `⌘ + /`,  
                  action: CLOSE_ALL_EXCEPT_ACTIVE
                }
              },
              {
                name: 'Close unsaved',
                shortcut: {
                  command:
                    osName && ['Windows', 'UNIX', 'Linux'].includes(osName)
                      ? `Ctrl + /`
                      : `⌘ + /`,
                  action: CLOSE_ALL_FRESH
                }
              } 
      ],
    }*/
  ];
  const openNewTab = (type) => {
    openTab({ __meta: { type } }, { id: '', type: ETabEntityTypes.Request });
  };

  return (
    <Dropdown>
      <Dropdown.Handler className="w-9 h-full border-r border-tabBorder bg-tabBackground2 flex items-center justify-center cursor-pointer">
        <VscEllipsis size={20} strokeWidth={1} />
      </Dropdown.Handler>
      <Dropdown.Options
        className="fc-dropdown with-category tab-option-action absolute type-1"
        options={tabMenus}
      />
    </Dropdown>
  );
};

export default Menu;
