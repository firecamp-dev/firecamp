//@ts-nocheck

import { useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import { ConfirmationPopover } from '@firecamp/ui-kit';

const DirectoryNode = ({
  item = {},
  icon = '',
  className,
  nodemenu,
  isOpen = false,
  onClick,
  onDelete = () => {},
  toggleRenaming,
  tabIndex,
  setRef = () => {},
  isRenaming,
  renameComp,
}) => {
  // console.log(item, "item directory")
  let _onDelete = () => {
    if (!item._meta.id) return;
    onDelete(item._toJSON());
  };

  return (
    <div
      className={classnames('collection_node', className)}
      // onKeyDown={e => e.key == 'Enter' && toggleRenaming(true)}
      tabIndex={tabIndex}
      ref={setRef}
    >
      <div className={'collection_node-head'}>
        <div className={classnames('collection_node-head-clickable')} onClick={onClick}>
          {icon != '' ? (
            <div className={classnames('collection_node-caret')}>
              {icon == 'folder' ? (
                <div
                  className={classnames(
                    isOpen ? 'icon-open-folder' : 'icon-folder'
                  )}
                ></div>
              ) : (
                ''
              )}
              {icon == 'caret' ? (
                <div
                  className={classnames(
                    isOpen ? 'icon-caret open' : 'icon-caret closed'
                  )}
                ></div>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
          {isRenaming ? (
            renameComp()
          ) : (
            <div className={classnames('collection_node-name')}>{item.name || ''}</div>
          )}
        </div>
        <div className={classnames('collection_node-action')}>
          <div
            className="collection_node-action-rename icon-rename"
            onClick={() => toggleRenaming(true)}
          ></div>
          <ConfirmationPopover
            id={item._meta.id}
            handler={<div className="iconv2-delete-v2-icon" />}
            title={`Are you sure to remove ${item.name || ''}?`}
            _meta={{
              showDeleteIcon: false,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            }}
            onConfirm={_onDelete}
          />
        </div>
        {nodemenu != '' ? (
          <div className={classnames('collection_node-menu')}>{nodemenu}</div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default DirectoryNode;
