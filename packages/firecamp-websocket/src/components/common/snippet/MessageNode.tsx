//@ts-nocheck

import { forwardRef } from 'react';
import classnames from 'classnames';

const MessageNode = forwardRef(
  ({ item = { name: '' }, icon = '', className = '', ...restProps }, ref) => {
    return (
      <div
        className={classnames('collection_message-node', className)}
        {...restProps}
        ref={ref}
      >
        <div className="collection_message-node-active-span"></div>
        <div className={classnames('collection_message-node-head')}>
          <div className="collection_message-node-title">{item.name}</div>
          <div className="collection_message-node-type">
            {item.meta && item.meta.type ? item.meta.type : ''}
          </div>
        </div>
        <div className="collection_message-node-text">{item.body}</div>
      </div>
    );
  }
);

export default MessageNode;
