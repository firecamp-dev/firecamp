import { useState } from 'react';
import {
  Container,
  Button,
  Input,
  ConfirmationPopover,
  Popover,
  EPopoverPosition,
  StatusBar,
} from '@firecamp/ui-kit';
import { EEmitterPayloadTypes } from '../../../../types';

const BodyControls = ({
  emitterName = '',
  isSaveEmitterPopoverOpen = false,
  tabData = {},
  collection = [],
  activeType = {},
  toggleSaveEmitterPopover = () => {},
  playgroundTabMeta = {},
  onAddEmitter = () => {},
  onUpdateEmitter = () => {},
  tabId = '',
  path = '',
  editorCommands = {},
  showClearPlaygroundButton = false,
  addNewEmitter = () => {},
}) => {
  let _renderKeyboardShortcutInfo = () => {
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
            <div className="pb-2">
              {Object.values(editorCommands).map((val, i) => {
                {
                  return (
                    <div className="flex" key={i}>
                      <div className="flex-1 pr-4 pl-2">{`${
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
            <div className="pb-2">
              {Object.values(editorCommands).map((val, i) => {
                {
                  return (
                    <div className="flex" key={i}>
                      <div className="flex-1 pr-4 pl-2 font-semibold">{`${
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
    <Container.Header>
      <StatusBar>
        <StatusBar.PrimaryRegion>
          <div data-tip={path} className="collection-path">
            {path || `./`}
          </div>
        </StatusBar.PrimaryRegion>
        <StatusBar.SecondaryRegion>
          {(!!(
            emitterName &&
            emitterName.trim() &&
            emitterName.trim().length
          ) &&
            activeType.id !== EEmitterPayloadTypes.file &&
            playgroundTabMeta.hasChange &&
            !playgroundTabMeta.isSaved) ||
          (playgroundTabMeta.hasChange && playgroundTabMeta.isSaved) ===
            true ? (
            <SaveEmitter
              emitterName={emitterName}
              isPopoverOpen={isSaveEmitterPopoverOpen}
              collection={collection || []}
              id={`push-message-${tabData.id || ''}`}
              hasChange={playgroundTabMeta.hasChange || false}
              onSubmit={onAddEmitter}
              onUpdate={onUpdateEmitter}
              toggleOpenPopover={(val) => toggleSaveEmitterPopover(val)}
            />
          ) : (
            ''
          )}
          {showClearPlaygroundButton === true ? (
            <ConfirmationPopover
              id={tabId}
              handler={
                <Button
                  id={`confirm-popover-handler-${tabId}`}
                  key="new_msg_button"
                  text={'+ New Emitter'}
                  ghost
                  transparent
                  sm
                />
              }
              title="Are you sure to reset playground and add new emitter?"
              _meta={{
                showDeleteIcon: false,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
              }}
              onConfirm={addNewEmitter}
            />
          ) : (
            ''
          )}
          <Popover
            positions={[EPopoverPosition.Right]}
            content={
              <div className="w-48">
                <div className="text-sm font-bold mb-1 text-appForegroundActive opacity-70 px-2 pt-2 pb-2 border-b border-appBorder">
                  Shortcuts
                </div>
                {_renderKeyboardShortcutInfo()}
              </div>
            }
          >
            <Popover.Handler id={`info-popover-${tabId}`}>
              <i className="iconv2-info-icon font-base"></i>
            </Popover.Handler>
          </Popover>
        </StatusBar.SecondaryRegion>
      </StatusBar>
      {/* <TabHeader className="padding-small height-small collection-path-wrapper">
        <TabHeader.Left>
          
        </TabHeader.Left>
        <TabHeader.Right>
          
        </TabHeader.Right>
      </TabHeader> */}
    </Container.Header>
  );
};
export default BodyControls;

const SaveEmitter = ({
  emitterName = '',
  isPopoverOpen = false,
  collection = [],
  id = '',
  hasChange = false,

  onSubmit = () => {},
  onUpdate = () => {},
  toggleOpenPopover = () => {},
}) => {
  const [emitterLabel, setEmitterLabel] = useState('');
  // let [is_popover_open, toggle_popover] = useState(false);
  const [focusedNode, setFocusedNode] = useState({
    __ref: { _relative_path: './' },
  });

  const _handleChangeName = (e) => {
    e.preventDefault();

    const { value } = e.target;
    setEmitterLabel(value);
  };

  const _onKeyDown = (e) => {
    if (e.key === 'Enter') {
      // e.preventDefault();
      _onSubmit(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      toggleOpenPopover(false);
    }
  };

  const _onSubmit = (e) => {
    emitterName = (emitterName || '').trim();
    if (!emitterName) return;

    // if (!emitterLabel.length) return;
    if (e) {
      e.preventDefault();
    }

    const emitterPayload = { label: emitterLabel };
    let path = '';

    if (focusedNode && focusedNode.__ref.id) {
      path =
        focusedNode.__ref && focusedNode.__ref._relative_path
          ? focusedNode.__ref._relative_path + `/${emitterName}`
          : '';
      emitterPayload = Object.assign({}, emitterPayload, {
        parentId: focusedNode.__ref.id,
        path,
      });
    } else {
      path =
        focusedNode.__ref && focusedNode.__ref._relative_path
          ? focusedNode.__ref._relative_path + `${emitterName}`
          : '';
      emitterPayload = Object.assign({}, emitterPayload, {
        path,
      });
    }

    // console.log(`emitterPayload`, emitterPayload);
    onSubmit(emitterPayload);
    toggleOpenPopover(!isPopoverOpen);
    setEmitterLabel('');
    setFocusedNode({
      __ref: { _relative_path: './' },
    });
  };

  const _onClickSaveMessage = () => {
    if (!emitterName.length) return;
    if (hasChange) {
      onUpdate();
    }
  };

  return (
    <Popover
      isOpen={isPopoverOpen}
      detach={false}
      onToggleOpen={() => {
        if (hasChange === false) {
          toggleOpenPopover(!isPopoverOpen);
        } else {
          toggleOpenPopover(false);
        }
      }}
      content={
        hasChange === false && isPopoverOpen === true ? (
          <div className="fc-popover-v2">
            <div className="fc-push-message">
              {collection && collection.length ? (
                <div className="fc-push-message-collection">
                  <label>
                    Select Folder{' '}
                    <span>({focusedNode.__ref._relative_path})</span>
                  </label>
                  {/*   <Collection
                    className="with-border"
                    onlyDirectory={true}
                    onNodeFocus={setFocusedNode}
                    data={collection}
                    primaryKey={'id'}
                    nodeRenderer={({
                      isDirectory,
                      item,
                      isExpanded,
                      classes,
                      getNodeProps,
                    }) => {
                      if (isDirectory) {
                        return (
                          <CollectionFcNode
                            isOpen={isExpanded}
                            name={item.name}
                            className={classes}
                            icon="folder"
                            {...getNodeProps()}
                          />
                        );
                      } else {
                        return (
                          <CollectionMsgNode
                            item={item}
                            className={classes}
                            {...getNodeProps()}
                          />
                        );
                      }
                    }}
                  /> */}
                </div>
              ) : (
                ''
              )}
              <Input
                autoFocus={true}
                type="text"
                name="label"
                id="status"
                className="fc-input border-alt small"
                placeholder="Emitter label"
                label="Emitter Label (Optional)"
                value={emitterLabel}
                onChange={_handleChangeName}
                onKeyDown={_onKeyDown}
                disabled={!emitterName}
              />

              {!emitterName ? (
                <div className="fc-error">Please write emitter name first</div>
              ) : (
                ''
              )}
            </div>

            <div className="flex mt-1 align-right">
              <Button text={'Save'} onClick={_onSubmit} primary iconRight />
            </div>
          </div>
        ) : (
          <></>
        )
      }
    >
      <Popover.Handler id={`SM-${id}`}>
        <Button
          text={'Save'}
          onClick={_onClickSaveMessage}
          sm
          primary
          ghost
          transparent
        />
      </Popover.Handler>
    </Popover>
  );
};
