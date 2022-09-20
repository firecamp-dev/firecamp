import { FC, forwardRef, useState } from 'react';
import classnames from 'classnames';
// import "./EnvVariablesCard.sass";
import { ConfirmationPopover } from '@firecamp/ui-kit';

const EnvCard: FC<any> = forwardRef(
  (
    {
      item = { name: '' },
      icon = '',
      className = '',
      meta = { allowRename: false, allowRemove: false },
      leafmenu = '',
      onSetVariables = () => {},
      onDelete = () => {},
      toggleRenaming,
      isRenaming,
      renameComp,
      ...restProps
    },
    ref
  ) => {
    let _onSetVariables = () => {
      if (!item._meta.id) return;
      let vari_payload = {
        id: item._meta.id,
        name: item.name || '',
        body: item.body || '',
        type: item.meta.type || '',
      };

      let path =
        item._meta && item._meta._relative_path
          ? item._meta._relative_path
          : '';

      onSetVariables(vari_payload, path);
    };
    // console.log(`item`, item);
    let _onDelete = () => {
      if (!item._meta.id) return;
      onDelete(item._toJSON());
    };

    return (
      <div
        className={classnames('fc-snippet-node', className)}
        {...restProps}
        ref={ref}
      >
        <div className="fc-snippet-node-active-span"></div>
        <div className={classnames('fc-snippet-node-head')}>
          {isRenaming ? (
            renameComp()
          ) : (
            <div className="fc-snippet-node-title">{item.name}</div>
          )}
        </div>
        <div className="fc-snippet-node-text">{item.body}</div>
        <div className={classnames('collection_node-action')}>
          {meta.allowRename ? (
            <div
              className="collection_node-action-rename icon-rename"
              onClick={(e) => {
                e.preventDefault();
                toggleRenaming(true);
              }}
            />
          ) : (
            ''
          )}
          {meta.allowRemove ? (
            <ConfirmationPopover
              id={`delete-environment-${item._meta.id || ''}`}
              handler={
                <div className="fc-action-delete iconv2-delete-v2-icon pr-1 text-sm" />
              }
              title="Are you sure remove?"
              _meta={{
                showDeleteIcon: false,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                tooltip: '',
              }}
              onConfirm={_onDelete}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
);

export default EnvCard;
