//@ts-nocheck

import { forwardRef, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import './MessageNode.sass';
import { ConfirmationPopover } from '@firecamp/ui-kit';

const MessageNode = forwardRef(
  (
    {
      item = { name: '' },
      icon = '',
      className = '',
      leafmenu = '',
      onSend = () => {},
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
      let msg_payload = {
        _meta: { id: item._meta.id },
        name: item.name || '',
        message: item.body || '',
        type: item.meta.type || '',
        envelope: item.meta.envelope || ''
      };

      let path =
        item._meta && item._meta._relative_path
          ? item._meta._relative_path
          : '';

      onSend(msg_payload, path);
    };
    // console.log(`item`, item);
    let _onDelete = () => {
      if (!item._meta.id) return;
      onDelete(item._toJSON());
    };

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
            {item.meta && item.meta.type ? item.meta.type : ''}
          </div>
        </div>
        <div className="collection_message-node-text">{item.body}</div>
        <div className={classnames('collection_node-action')}>
          <div
            className="collection_node-action-rename icon-rename"
            onClick={e => {
              e.preventDefault();
              toggleRenaming(true);
            }}
          ></div>
          <ConfirmationPopover
            id={item._meta.id}
            handler={<div className="fc-action-delete iconv2-delete-v2-icon pr-1 text-sm" />}
            title={`Are you sure to remove ${item.name || ''}?`}
            _meta={{
              showDeleteIcon: false,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No'
            }}
            position={'top'}
            onConfirm={_onDelete}
          />
          <div
            className="fc-action-send iconv2-send-icon"
            onClick={e => {
              e.preventDefault();
              _onSend();
            }}
          ></div>
        </div>
      </div>
    );
  }
);

export default MessageNode;
