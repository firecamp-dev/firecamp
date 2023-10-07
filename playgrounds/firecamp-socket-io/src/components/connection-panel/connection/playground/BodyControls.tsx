import { useMemo } from 'react';
import {
  Container,
  Button,
  Popover,
  EPopoverPosition,
  StatusBar,
  TabHeader,
} from '@firecamp/ui';
import { EditorCommands } from '../../../../constants';
import { IStore, useStore, useStoreApi } from '../../../../store';

const BodyControls = ({ tabId = '', path = '', addNewEmitter = () => {} }) => {
  const plg = useStore((s: IStore) => s.playground);
  const { promptSaveItem, updateItem, getItemPath, resetPlaygroundEmitter } =
    useStoreApi().getState() as IStore;

  const emitterPath = useMemo(() => {
    return getItemPath(plg.selectedEmitterId);
  }, [plg.selectedEmitterId]);

  const isEmitterSaved = !!plg.emitter.__ref.id;
  const saveEmitter = () => {
    if (isEmitterSaved) updateItem();
    else promptSaveItem();
  };

  const showNewEmitterBtn = !!isEmitterSaved;
  const showSaveEmitterBtn = plg.playgroundHasChanges;

  return (
    <Container.Header>
      <StatusBar className="bg-statusBar-background-active px-1">
        <StatusBar.PrimaryRegion>
          <div data-tip={path} className="collection-path">
            {`./${emitterPath}`}
          </div>
        </StatusBar.PrimaryRegion>
        <StatusBar.SecondaryRegion>
          {/* <ShortcutsInfo tabId={tabId} /> */}
        </StatusBar.SecondaryRegion>
      </StatusBar>
      <TabHeader className="padding-small height-small collection-path-wrapper">
        <TabHeader.Left></TabHeader.Left>
        <TabHeader.Right>
          {showNewEmitterBtn === true ? (
            <Button
              id={`reset-plg-emitter-${tabId}`}
              key="new_msg_button"
              text={'+ New Emitter'}
              onClick={resetPlaygroundEmitter}
              ghost
              compact
              xs
            />
          ) : (
            <></>
          )}
          {showSaveEmitterBtn ? (
            <Button
              id={`btn-${tabId}`}
              key="save_button"
              text={isEmitterSaved ? 'Save Emitter Changes' : 'Save Emitter'}
              onClick={saveEmitter}
              secondary
              compact
              xs
            />
          ) : (
            <></>
          )}
        </TabHeader.Right>
      </TabHeader>
    </Container.Header>
  );
};
export default BodyControls;

const ShortcutsInfo = ({ tabId }) => {
  const _renderKeyboardShortcutInfo = () => {
    // console.log(`showClearPlaygroundButton`,showClearPlaygroundButton)
    try {
      let OSName = '';
      if (navigator.appVersion.indexOf('Win') != -1) OSName = 'Windows';
      if (navigator.appVersion.indexOf('Mac') != -1) OSName = 'MacOS';
      if (navigator.appVersion.indexOf('X11') != -1) OSName = 'UNIX';
      if (navigator.appVersion.indexOf('Linux') != -1) OSName = 'Linux';

      switch (OSName) {
        case 'Windows':
        case 'UNIX':
        case 'Linux':
          return (
            <div>
              {Object.values(EditorCommands).map((val, i) => {
                {
                  return (
                    <div className="flex" key={i}>
                      <div className="flex-1 pr-4 ">{`${
                        val.name || ''
                      }`}</div>
                      <div className="ml-auto pr-2">{`${
                        val.view ? val.view['win'] : ''
                      }`}</div>
                    </div>
                  );
                }
              })}
            </div>
          );
          break;

        case 'MacOS':
          return (
            <div>
              {Object.values(EditorCommands).map((val, i) => {
                {
                  return (
                    <div className="flex" key={i}>
                      <div className="flex-1 pr-4 font-semibold">{`${
                        val.name || ''
                      }`}</div>
                      <div className="pr-2 ml-auto">{`${
                        val.view ? val.view['mac'] : ''
                      }`}</div>
                    </div>
                  );
                }
              })}
            </div>
          );
          break;

        default:
          return '';
      }
      return 'Body';
    } catch (e) {
      return '';
    }
  };

  return (
    <Popover
      positions={[EPopoverPosition.Right]}
      content={
        <div>
          <div className="text-sm font-bold mb-1 text-app-foreground-active opacity-70 px-2 pt-2 border-b border-app-border">
            Shortcuts
          </div>
          {_renderKeyboardShortcutInfo()}
        </div>
      }
    >
      <Popover.Handler id={`info-popover-${tabId}`}>
        info icon {/* TODO: add info icon here */}
      </Popover.Handler>
    </Popover>
  );
};
