import { FC, useEffect } from 'react';
import cx from 'classnames';
import shallow from 'zustand/shallow';
import { Container, Dropdown, Button } from '@firecamp/ui-kit';
import * as monaco from 'monaco-editor';
import { IFEThemes } from '@firecamp/ui-kit/src/components/editors/monaco/lang/IFE.constants';
import { ERequestTypes } from '@firecamp/types';
import {
  FcIconGetSquare,
  FcIconGraphQL,
  FcIconSocketIo,
  FcIconSocketIoSquare,
  FcIconWebSocket,
} from '@firecamp/ui-kit';

import { usePlatformStore } from '../../../store/platform';
import { EThemeColor, EThemeMode } from '../../../types';
import { platformEmitter as emitter } from '../../../services/platform-emitter';
import { EPlatformTabs } from '../../../services/platform-emitter/events';

const Home: FC<any> = () => {
  useEffect(() => {
    // F?.reactGA?.pageview?.('home');
  }, []);

  const _openTab = (type?: ERequestTypes) => {
    const allowed_app = [
      ERequestTypes.SocketIO,
      ERequestTypes.WebSocket,
      ERequestTypes.Rest,
      ERequestTypes.GraphQL,
    ];
    // if (!allowed_app.includes(type))
    emitter.emit(EPlatformTabs.openNew, type);
  };

  const apiCategories = [
    {
      header: 'Stateless APIs',
      list: [
        {
          name: 'Rest',
          prefix: () => (
            <div className={'dropdown-icon'}>
              <FcIconGetSquare className="text-rest" size={24} />
            </div>
          ),
          onClick: () => {
            _openTab(ERequestTypes.Rest);
          },
        },
        {
          name: 'GraphQL',
          prefix: () => (
            <div className={'dropdown-icon'}>
              <FcIconGraphQL className="text-graphql" size={24} />
            </div>
          ),
          onClick: () => {
            _openTab(ERequestTypes.GraphQL);
          },
        },
      ],
    },
    {
      header: 'Event Driven APIs',
      list: [
        {
          name: 'WebSocket',
          prefix: () => (
            <div className={'dropdown-icon invert'}>
              <FcIconWebSocket className="text-websocket" size={24} />
            </div>
          ),
          onClick: () => {
            _openTab(ERequestTypes.WebSocket);
          },
        },
        {
          name: 'SocketIO',
          prefix: () => (
            <div className={'dropdown-icon invert'}>
              <FcIconSocketIoSquare className="text-socket" size={24} />
            </div>
          ),
          onClick: () => {
            _openTab(ERequestTypes.SocketIO);
          },
        },
        {
          name: 'SSE',
          prefix: () => (
            <div className={'dropdown-icon'}>
              {/* <img src={'icon/png/icons-color/sse.png'} /> */}
            </div>
          ),
          postfix: () => <span>Coming soon</span>,
          disabled: true,
        },
      ],
    },
    {
      header: 'Hybrid APIs',
      list: [
        {
          name: 'gRPC',
          prefix: () => (
            <div className={'dropdown-icon'}>
              {/* <img src={'icon/png/icons-color/grpc.png'} /> */}
            </div>
          ),
          postfix: () => <span>Coming soon</span>,
          disabled: true,
        },
        {
          name: 'gRPC',
          prefix: () => (
            <div className={'dropdown-icon'}>
              {/* <img src={'icon/png/icons-color/rpc.png'} /> */}
            </div>
          ),
          postfix: () => <span>Coming soon</span>,
          disabled: true,
        },
      ],
    },
  ];

  return (
    <Container className="px-14 py-20" overflow="visible">
      <Container.Header>
        <div className="text-2xl mb-8 font-normal">
          Welcome To Firecamp!
          <span className="block text-base font-light text-appForegroundInActive">
            This campsite is built for you, to give power in your hand while you
            work with your favorite API-style.
          </span>
        </div>
      </Container.Header>
      <Container.Body overflow="visible">
        <div className="mb-8">
          <div className="block text-base uppercase font-semibold text-appForegroundInActive mb-6">
            Popular Requests
          </div>
          <div className="flex-col border-b border-appBorder pb-4 w-fit flex-none">
            <RequestItem
              label="Create Rest API"
              icon={<FcIconGetSquare size={50} />}
              openRequest={() => _openTab(ERequestTypes.Rest)}
            />

            <RequestItem
              label="Create GraphQL Playground"
              icon={<FcIconGraphQL size={24} />}
              openRequest={() => _openTab(ERequestTypes.GraphQL)}
            />

            <RequestItem
              label="Create WebSocket Playground"
              icon={<FcIconWebSocket size={24} />}
              openRequest={() => _openTab(ERequestTypes.WebSocket)}
              hasInvertIcon={true}
            />

            <RequestItem
              label="Create SocketIO Playground"
              icon={<FcIconSocketIoSquare size={24} />}
              openRequest={() => _openTab(ERequestTypes.SocketIO)}
              hasInvertIcon={true}
            />
          </div>
        </div>
        <div className="mb-8">
          <Dropdown>
            <Dropdown.Handler className="flex items-center invert w-fit">
              {/* <img
                className="max-h-4 mr-2 absolute "
                src="icon/png/initial-request-icon.png"
              /> */}
              <Button
                text="Create a request"
                md
                secondary
                withCaret={true}
                transparent={true}
                className="!border-0 !border-transparent !px-6"
              />
            </Dropdown.Handler>
            <Dropdown.Options
              className="fc-dropdown with-header type-1"
              options={apiCategories}
            />
          </Dropdown>
        </div>

        <div className="mb-8">
          <div className="block text-base uppercase font-semibold text-appForegroundInActive mb-6">
            Workspace Settings
          </div>
          <div>
            <div
              className="flex mb-4 w-fit cursor-pointer items-baseline"
              onClick={() => {
                // _onOpenModal(
                //   EModals.WORKSPACE_SETTING,
                //   EWorkspaceSettingTabs.IMPORT
                // );
              }}
            >
              <div className="flex items-center mr-2">
                <span className="iconv2-import-icon"></span>
              </div>
              <div className="text-appForegroundInActive">Import</div>
            </div>

            <div
              className="cursor-pointer text-xl icon-more w-fit"
              onClick={() => {
                // _onOpenModal(
                //   EModals.WORKSPACE_SETTING,
                //   EWorkspaceSettingTabs.SETTING
                // );
              }}
            />
          </div>
        </div>
        <Theme />
      </Container.Body>
    </Container>
  );
};

export default Home;

const RequestItem: FC<IRequestItem> = ({
  label,
  icon,
  hasInvertIcon = false,
  openRequest = () => {},
}) => {
  return (
    <div
      className={cx('flex text-sm mr-4 items-center mb-4  text-appForegroundInActive cursor-pointer hover:text-appForegroundActive', {
        invert: hasInvertIcon,
      })}
      onClick={openRequest}
    >
      <div className="flex-none w-6 h-6 mr-3 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-base">{label}</div>
    </div>
  );
};

let Theme: FC<any> = () => {
  const themes = [
    {
      className: 'themeBG light-green',
      value: {
        name: 'theme-light primary-green',
        class: 'theme-light primary-green',
        mode: EThemeMode.Light,
        color: EThemeColor.Green,
      },
    },
    {
      className: 'themeBG light-orange',
      value: {
        name: 'theme-light primary-orange',
        class: 'theme-light primary-orange',
        mode: EThemeMode.Light,
        color: EThemeColor.Orange,
      },
    },
    {
      className: 'themeBG dark-green',
      value: {
        name: 'theme-dark primary-green',
        class: 'theme-dark primary-green',
        mode: EThemeMode.Dark,
        color: EThemeColor.Green,
      },
    },
    {
      className: 'themeBG dark-orange',
      value: {
        name: 'theme-dark primary-orange',
        class: 'theme-dark primary-orange',
        mode: EThemeMode.Dark,
        color: EThemeColor.Orange,
      },
    },
  ];

  let { theme, updateTheme } = usePlatformStore(
    (s) => ({ theme: s.theme, updateTheme: s.updateTheme }),
    shallow
  );

  useEffect(() => {
    try {
      // Set app body theme
      document.body.className = `theme-${theme?.mode || 'light'} primary-${
        theme?.color || 'orange'
      }`;

      const monacoTheme =
        theme?.mode == EThemeMode.Dark ? IFEThemes.DARK : IFEThemes.LITE;
      console.log(monacoTheme, 'monacoTheme');
      // Set monaco editor theme
      monaco.editor.setTheme(monacoTheme);
    } catch (error) {
      console.log({ error });
    }
  }, [theme || {}]);

  const _setTheme = (theme) => {
    try {
      //Set theme in Preference
      updateTheme(theme);

      //Set monaco editor theme
      theme?.value?.mode == EThemeMode.Dark ? IFEThemes.DARK : IFEThemes.LITE;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fc-theme-wrapper">
      <div className="block text-base uppercase font-semibold text-appForegroundInActive mb-6">
        Themes
      </div>
      <div className="flex">
        {themes.map((th, index) => {
          return (
            <div
              className={cx(
                {
                  active:
                    theme?.color === th?.value?.color &&
                    theme?.mode === th?.value?.mode,
                },
                'fc-theme'
              )}
              key={index}
              onClick={(e) => {
                _setTheme(th.value);
              }}
            >
              <div className={th.className}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Home tab request item
 */
interface IRequestItem {
  /**
   * label for request item
   */
  label: string;

  /**
   * Request item icon path
   */

  icon: JSX.Element;

  /**
   * Boolean value whether having inverted icon or not
   */
  hasInvertIcon?: boolean;

  /**
   * Open request tab
   */
  openRequest: () => void;
}
