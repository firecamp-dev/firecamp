import { FC, useEffect } from 'react';
import cx from 'classnames';
import shallow from 'zustand/shallow';
import { VscArrowDown } from '@react-icons/all-files/vsc/VscArrowDown';
import { Container, EditorApi, Row, Column, FcLogo } from '@firecamp/ui';
import { ERequestTypes, EEditorTheme } from '@firecamp/types';
import {
  FcIconGetSquare,
  FcIconGraphQL,
  FcIconSocketIoSquare,
  FcIconWebSocket,
} from '@firecamp/ui';
import { CalloutSection } from './HomeCalloutSection';
import { usePlatformStore } from '../../../store/platform';
import { useTabStore } from '../../../store/tab';
import { EThemeColor, EThemeMode } from '../../../types';
import { ETabEntityTypes } from '../types';
import { useUserStore } from '../../../store/user';
import { useWorkspaceStore } from '../../../store/workspace';

const Home: FC<any> = () => {
  const { user, isGuest } = useUserStore(
    (s) => ({
      user: s.user,
      isGuest: s.isGuest,
    }),
    shallow
  );
  const { open: openTab } = useTabStore.getState();
  const { openImportTab } = useWorkspaceStore.getState();

  const _openTab = (type?: ERequestTypes | 'environment') => {
    const allowed_app = [
      ERequestTypes.SocketIO,
      ERequestTypes.WebSocket,
      ERequestTypes.Rest,
      ERequestTypes.GraphQL,
    ];
    // if (!allowed_app.includes(type))
    openTab({ __meta: { type } }, { id: '', type: ETabEntityTypes.Request });
  };

  const greetingsTo = isGuest
    ? 'Friend'
    : user?.name?.split(' ')[0] || 'Friend';
  return (
    <Container className="px-14 py-20" overflow="visible">
      <Container.Header>
        <div className="mb-3">
          <FcLogo className="w-14" size={80} />
        </div>
        <div className="text-2xl mb-8 font-normal">
          Hey {greetingsTo}, Welcome To Firecamp!
          <span className="block text-base font-light text-app-foreground-inactive">
            This campsite is designed for you, giving you the power to do what
            you love with APIs.
          </span>
        </div>
      </Container.Header>
      <Container.Body overflow="visible">
        <Row flex={1} overflow="auto" className="h-full">
          <Column>
            <div className="mb-8">
              <div className="block text-base uppercase font-semibold text-app-foreground-inactive mb-6">
                Popular Requests
              </div>
              <div className="flex-col border-b border-app-border w-fit flex-none">
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
                <hr className="pb-4" />
                <RequestItem
                  label="Import Collection"
                  icon={<VscArrowDown size={16} />}
                  openRequest={openImportTab}
                />
              </div>
            </div>
            <Theme />
          </Column>

          <Column>
            <CalloutSection />
          </Column>
        </Row>
      </Container.Body>
    </Container>
  );
};

export default Home;

const RequestItem: FC<IRequestItem> = ({
  label,
  icon,
  hasInvertIcon = false, //TODO : removed classname
  openRequest = () => {},
}) => {
  return (
    <div
      className={cx(
        'flex text-sm mr-4 items-center mb-4  text-app-foreground-inactive cursor-pointer hover:text-app-foreground-active'
      )}
      onClick={openRequest}
    >
      <div className="flex-none w-6 h-6 mr-3 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-base">{label}</div>
    </div>
  );
};

const Theme: FC<any> = () => {
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

  const { theme, updateTheme } = usePlatformStore(
    (s) => ({ theme: s.theme, updateTheme: s.updateTheme }),
    shallow
  );

  useEffect(() => {
    try {
      // Set app body theme
      document.body.className = `theme-${theme?.mode || 'light'} primary-${
        theme?.color || 'orange'
      }`;

      const editorTheme =
        theme?.mode == EThemeMode.Dark ? EEditorTheme.Dark : EEditorTheme.Lite;
      console.log(editorTheme, 'editorTheme');

      console.log(editorTheme);
      localStorage.setItem('editorTheme', editorTheme);
      EditorApi.setEditorTheme(editorTheme);
    } catch (error) {
      console.log({ error });
    }
  }, [theme || {}]);

  const _setTheme = (theme) => {
    try {
      //Set theme in Preference
      updateTheme(theme);

      //Set monaco editor theme
      theme?.value?.mode == EThemeMode.Dark
        ? EEditorTheme.Dark
        : EEditorTheme.Lite;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fc-theme-wrapper">
      <div className="block text-base uppercase font-semibold text-app-foreground-inactive mb-6">
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
  /** label for request item */
  label: string;

  /** request item icon path */
  icon: JSX.Element;

  /** Boolean value whether having inverted icon or not */
  hasInvertIcon?: boolean;

  /** Open request tab */
  openRequest: () => void;
}
