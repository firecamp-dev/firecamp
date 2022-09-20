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
import { ITabFns } from '../types/tab';
import getOs from '../../../services/get-os';

let osName = getOs();

const Menu: FC<ITabMenu> = ({ tabFns }) => {
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
            tabFns.open(ERequestTypes.Rest);
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
            tabFns.open(ERequestTypes.GraphQL);
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
            tabFns.open(ERequestTypes.WebSocket);
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
            tabFns.open(ERequestTypes.SocketIO);
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
              {_misc.firecampAgent() === EFirecampAgent.desktop ? (
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
            tabFns.closeAll(e);
          },
        },
        {
          name: 'Close saved',
          postfix: () => (
            <div className="dropdown-text">
              {_misc.firecampAgent() === EFirecampAgent.desktop ? (
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
            // console.log({ option, e });
            tabFns.closeAllSaved(e);
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

interface ITabMenu {
  tabFns: ITabFns;
}
