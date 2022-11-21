import { forwardRef } from 'react';
import classnames from 'classnames';
import './EmitterNode.sass';
import { ConfirmationPopover } from '@firecamp/ui-kit';
import _cloneDeep from 'lodash/cloneDeep';

const EmitterNode = forwardRef(
  (
    {
      item = { name: '' },
      icon = '',
      className = '',
      leafmenu = '',
      allowControls = true,
      onEmit = () => {},
      onDelete = () => {},
      toggleRenaming,
      isRenaming,
      renameComp,
      ...restProps
    },
    ref
  ) => {
    // console.log(`item`,item)

    let _onSend = () => {
      if (!item._meta.id) return;

      let path =
        item._meta && item._meta._relative_path
          ? item._meta._relative_path
          : '';

      onEmit(item, path);
    };
    // console.log(`item`, item);
    let _onDelete = () => {
      if (!item._meta.id) return;
      onDelete(item._toJSON());
    };

    let emitterArg = _cloneDeep(item.body ? item.body[0] : {});
    if (typeof emitterArg.payload === 'boolean') {
      emitterArg.payload = emitterArg.payload + '';
    }
    // console.log(`item`, item);
    // console.log(`emitterArg`, emitterArg, typeof emitterArg);
    if (
      emitterArg &&
      emitterArg.meta.type === 'file' &&
      typeof emitterArg.payload !== 'string'
    ) {
      emitterArg.payload = emitterArg.payload.name || '';
    }

    return (
      <div
        className={classnames('collection_message-node', className)}
        {...restProps}
        ref={ref}
      >
        <div className="collection_message-node-active-span"></div>
        <div className={classnames('collection_message-node-head')}>
          {isRenaming ? (
            renameComp()
          ) : (
            <div className="collection_message-node-title">{item.name}</div>
          )}

          <div className="collection_message-node-type">
            {item.meta && item.meta.label ? item.meta.label : ''}
          </div>
          {item.body &&
          Array.isArray(item.body) &&
          item.body.length &&
          item.body.length - 1 > 0 ? (
            <div className="collection_message-node-more">
              {item.body.length - 1 > 1
                ? `+${item.body.length - 1} args`
                : `+${item.body.length - 1} arg`}
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="collection_message-node-text">{emitterArg.payload}</div>
        {!!allowControls ? (
          <div className={classnames('collection_node-action')}>
            <div
              className="collection_node-action-rename icon-rename"
              onClick={e => {
                e.preventDefault();
                toggleRenaming(true);
              }}
            />
            <ConfirmationPopover
              id={item._meta.id}
              handler={
                <div className="fc-action-delete iconv2-delete-v2-icon pr-1 text-sm" />
              }
              title={`Are you sure to remove ${item.name || ''}?`}
              _meta={{
                showDeleteIcon: false,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
              }}
              onConfirm={_onDelete}
            />
            <div
              className="fc-action-send iconv2-send-icon"
              onClick={e => {
                e.preventDefault();
                _onSend();
              }}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
);

export default EmitterNode;
