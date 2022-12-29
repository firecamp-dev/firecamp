import { forwardRef } from 'react';
import classnames from 'classnames';

const MessageNode = forwardRef(
  (props, ref) => {
    const { item = { name: '' }, icon = '', className = '', ...restProps } = props;
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
            {item.__meta && item.__meta.type ? item.__meta.type : ''}
          </div>
        </div>
        <div className="collection_message-node-text">{item.body}</div>
      </div>
    );
  }
);

export default MessageNode;
