import { FC, useState, Fragment } from 'react';
import { VscFiles } from '@react-icons/all-files/vsc/VscFiles';
import { VscHistory } from '@react-icons/all-files/vsc/VscHistory';
import { VscAccount } from '@react-icons/all-files/vsc/VscAccount';
import { VscSettingsGear } from '@react-icons/all-files/vsc/VscSettingsGear';
import { VscLock } from '@react-icons/all-files/vsc/VscLock';
import { BiCookie } from '@react-icons/all-files/bi/BiCookie';
import { RiBracesLine } from '@react-icons/all-files/ri/RiBracesLine';
import { ActivityBar, Column, Resizable } from '@firecamp/ui-kit';
import { useHotkeys } from 'react-hotkeys-hook';
import cx from 'classnames';

import Explorer from '../activity-bar/explorer/Explorer';
// import History from '../activity-bar/history/History';
import getOs from '../../services/get-os';
import Environment from '../activity-bar/environment/Environment';
import platformContext from '../../services/platform-context';

// check if MAC OS
const isMac = !['Windows', 'UNIX', 'Linux'].includes(getOs());

// shortcut prefix
const scPrefix = isMac ? '⌘' : 'ctrl';

enum EActivityBarItems {
  Explorer = 'Explorer',
  Environment = 'Environment',
  History = 'History',
  User = 'User',
  Settings = 'Settings',
  Cookie = 'Cookie',
  SslNProxy = 'Ssl_And_Proxy',
}

const compositeBarItems = [
  {
    id: EActivityBarItems.Explorer,
    icon: (
      <VscFiles
        // data-tip={`Collections (${scPrefix} ⇧ C)`}
        title="Collections Explorer"
        data-for={EActivityBarItems.Explorer}
        tabIndex={-1}
      />
    ),
    // text: `Collections (${scPrefix} ⇧ C)`,
    item: EActivityBarItems.Explorer,
  },
  {
    id: EActivityBarItems.Environment,
    icon: (
      <RiBracesLine
        // data-tip={`Environment (${scPrefix} ⇧ E)`}
        title="Environment"
        data-for={EActivityBarItems.Environment}
        tabIndex={-1}
      />
    ),
    // text: `Environment (${scPrefix} ⇧ E)`,
    item: EActivityBarItems.Environment,
  },
  {
    id: EActivityBarItems.History,
    icon: (
      <VscHistory
        // data-tip={`History (${scPrefix} ⇧ H)`}
        title="History"
        data-for={EActivityBarItems.History}
        tabIndex={-1}
      />
    ),
    // text: `History (${scPrefix} ⇧ H)`,
    item: EActivityBarItems.History,
  },
];

const actionBarItems = [
  {
    id: EActivityBarItems.SslNProxy,
    icon: (
      <VscLock
        data-tip={`SSL and proxy (${scPrefix} ⇧ P)`}
        data-for={EActivityBarItems.SslNProxy}
        tabIndex={-1}
      />
    ),
    text: `SSL and proxy (${scPrefix} ⇧ P)`,
    item: EActivityBarItems.SslNProxy,
  },
  {
    id: EActivityBarItems.Cookie,
    icon: (
      <BiCookie
        data-tip={`Cookie (${scPrefix} ⇧ O)`}
        data-for={EActivityBarItems.Cookie}
        tabIndex={-1}
      />
    ),
    text: `Cookie (${scPrefix} ⇧ O)`,
    item: EActivityBarItems.Cookie,
  },
  {
    id: EActivityBarItems.User,
    icon: (
      <VscAccount
        data-tip={`User (${scPrefix} ⇧ U)`}
        data-for={EActivityBarItems.User}
        tabIndex={-1}
      />
    ),
    text: `User (${scPrefix} ⇧ U)`,
    item: EActivityBarItems.User,
  },
  {
    id: EActivityBarItems.Settings,
    icon: (
      <VscSettingsGear
        data-tip={`Settings (${scPrefix} ⇧ /)`}
        data-for={EActivityBarItems.Settings}
        tabIndex={-1}
      />
    ),
    text: `Settings (${scPrefix} ⇧ /)`,
    item: EActivityBarItems.Settings,
  },
];

const SidebarContainer: FC<any> = () => {
  const user = platformContext.app.user.get();
  let [activeItem, setActiveItem] = useState<EActivityBarItems | null>(
    user?.__ref?.id && EActivityBarItems.Explorer
  );

  useHotkeys(`${isMac ? 'cmd' : 'ctrl'}+Shift+C`, (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Open collection in sidebar
    _setActiveItem(
      compositeBarItems.find((i) => i.id === EActivityBarItems.Explorer)
    );
  });

  useHotkeys(`${isMac ? 'cmd' : 'ctrl'}+Shift+E`, (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Open environment modal
    _setActiveItem(
      compositeBarItems.find((i) => i.id === EActivityBarItems.Environment)
    );
  });

  useHotkeys(`${isMac ? 'cmd' : 'ctrl'}+Shift+H`, (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Open history in sidebar
    _setActiveItem(
      compositeBarItems.find((i) => i.id === EActivityBarItems.History)
    );
  });

  useHotkeys(`${isMac ? 'cmd' : 'ctrl'}+Shift+P`, (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Open ssl and proxy modal
    _setActiveItem(
      compositeBarItems.find((i) => i.id === EActivityBarItems.SslNProxy)
    );
  });

  useHotkeys(`${isMac ? 'cmd' : 'ctrl'}+Shift+O`, (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Open cookie modal
    _setActiveItem(
      compositeBarItems.find((i) => i.id === EActivityBarItems.Cookie)
    );
  });

  useHotkeys(`${isMac ? 'cmd' : 'ctrl'}+Shift+U`, (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Open user setting/ login modal
    _setActiveItem(actionBarItems.find((i) => i.id === EActivityBarItems.User));
  });

  useHotkeys(`${isMac ? 'cmd' : 'ctrl'}+Shift+/`, (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Open workspace settings modal
    _setActiveItem(
      actionBarItems.find((i) => i.id === EActivityBarItems.Settings)
    );
  });

  useHotkeys(`${isMac ? 'cmd' : 'ctrl'}+L`, (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Open user sign in modal
    _setActiveItem(actionBarItems.find((i) => i.id === EActivityBarItems.User));
  });

  useHotkeys(
    `${isMac ? 'cmd' : 'ctrl'}+B`,
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      /**
       * find and set active: toggle current active item.
       * if any active item not found then select Explorer from composite bar
       */
      const itemToSetActive =
        compositeBarItems.find((i) => i.id === activeItem) ||
        compositeBarItems[0];
      _setActiveItem(itemToSetActive);
    },
    [activeItem]
  );

  /**
   * set active item to show sidebar
   * open modals on clicking on the action item
   */
  const _setActiveItem = async (selected) => {
    if (!selected?.id) return;
    else if (selected.item == EActivityBarItems.User)
      platformContext.app.modals.openSaveRequest(); // openUserProfile();
    else if (selected.item == EActivityBarItems.Settings)
      platformContext.app.modals.openWorkspaceManagement();
    else if (selected.item == EActivityBarItems.SslNProxy)
      platformContext.app.modals.openWorkspaceManagement();
    else if (selected.item == EActivityBarItems.Cookie)
      platformContext.app.modals.openOrgManagement();
    else setActiveItem((s) => (selected.id == s ? null : selected?.id));
  };

  /**
   * Render sidebar with respect to active item
   */
  const _renderSidebar = () => {
    switch (activeItem) {
      case EActivityBarItems.Explorer:
        return <Explorer />;
      case EActivityBarItems.Environment:
        return <Environment />;
      case EActivityBarItems.History:
        return <>Coming soon.</>;
      default:
        return <span />;
    }
  };

  return (
    <Fragment>
      <ActivityBar>
        <ActivityBar.CompositeBar
          items={compositeBarItems}
          activeItem={activeItem}
          onClickItem={_setActiveItem}
        />
        <ActivityBar.ActionBar
          items={actionBarItems}
          onClickItem={_setActiveItem}
        />
      </ActivityBar>
      {activeItem ? (
        <Resizable
          width={'250'}
          height="100%"
          right={true}
          minWidth={'250'}
          maxWidth={'600'}
          className={cx({ closed: false })}
        >
          <Column className="bg-appBackground2 border-r border-appBorder">
            {_renderSidebar()}
          </Column>
        </Resizable>
      ) : (
        <></>
      )}
    </Fragment>
  );
};

export default SidebarContainer;
