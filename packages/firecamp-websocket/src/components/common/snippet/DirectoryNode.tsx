import classnames from 'classnames';

const DirectoryNode = ({
  item = {},
  icon = '',
  className,
  nodemenu,
  isOpen = false,
  onClick
}) => {
  return (
    <div className={classnames('collection_node', className)}>
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
          <div className={classnames('collection_node-name')}>{item.name || ''}</div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryNode;
