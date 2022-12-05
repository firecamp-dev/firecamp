import { FC } from 'react';
import { EFirecampAgent, ERequestTypes } from '@firecamp/types';
import { Dropdown } from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import { VscEllipsis } from '@react-icons/all-files/vsc/VscEllipsis';

import {
  FcGetSquare,
  FcGraphQL,
  FcSocketIoSquare,
  FcWebSocket,
} from '../../common/icons';

import getOs from '../../../services/get-os';
import { platformEmitter as emitter } from '../../../services/platform-emitter';
import { EPlatformTabs } from '../../../services/platform-emitter/events';
import { useTabStore } from '../../../store/tab';

let osName = getOs();

const Menu: FC = () => {
  const { close } = useTabStore.getState();
  const tabMenus = [
    {
      header: 'Create A Request',
      list: [
        {
          name: 'Rest',
          prefix: () => (
            <div className={'dropdown-icon'}>
              {/* <img src={'icon/png/icons-gray/http.png'} /> */}
              <FcGetSquare className="text-rest" size={24} />
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
              {/* <img src={'icon/png/icons-gray/graphql.png'} /> */}
              {<FcGraphQL className="text-graphql" size={24} />}
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
              {/* <img src={'icon/png/icons-gray/websocket.png'} /> */}
              <FcWebSocket className="text-websocket" size={24} />
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
              {/* <img src={'icon/png/icons-gray/socketio.png'} /> */}
              <FcSocketIoSquare className="text-socket" size={24} />
            </div>
          ),
          onClick: () => {
            openNewTab(ERequestTypes.SocketIO);
          },
        },
      ],
    },
    {
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
        /* {   
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
              } */
      ],
    },
  ];

  const openNewTab = (type) => {
    emitter.emit(EPlatformTabs.openNew, type);
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
