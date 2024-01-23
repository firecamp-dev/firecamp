import cx from 'classnames';
import { FolderOpen, Folder, Plus, Trash2 } from 'lucide-react';
import { VscTriangleRight } from '@react-icons/all-files/vsc/VscTriangleRight';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import { Button } from '@firecamp/ui';

export default {
  renderItemArrow: ({ item, context }) => {
    // console.log(item, 'arrow context');
    if (item.data?.__ref?.isItem) {
      // return <div className={cx('collection_leaf-node-type')}>Msg.</div>;
    } else if (item.data?.__ref?.isFolder) {
      return context.isExpanded ? (
        <>
          <VscTriangleDown
            className="mr-1 flex-none"
            size={12}
            opacity={'0.6'}
          />
          <FolderOpen
            className="mr-1 flex-none"
            size={16}
            opacity={'0.8'}
          />
        </>
      ) : (
        <>
          <VscTriangleRight
            className="mr-1 flex-none"
            size={12}
            opacity={'0.6'}
          />
          <Folder
            className="mr-1 flex-none"
            size={16}
            opacity={0.8}
          />
        </>
      );
    } else {
      return <></>;
    }
  },

  renderItemTitle: ({ item, title, context, info }) => {
    // console.log(title, "title...")
    if (!info.isSearching || !context.isSearchMatching) {
      return (
        <>
          {title} - {item.children?.length}
        </>
      );
    } else {
      const startIndex = title
        .toLowerCase()
        .indexOf(info.search!.toLowerCase());
      return (
        <>
          {startIndex > 0 && <span>{title.slice(0, startIndex)}</span>}
          <span className="rct-tree-item-search-highlight">
            {title.slice(startIndex, startIndex + info.search!.length)}
          </span>
          {startIndex + info.search!.length < title.length && (
            <span>
              {title.slice(startIndex + info.search!.length, title.length)}
            </span>
          )}
        </>
      );
    }
  },

  renderItem: ({
    item,
    depth,
    children,
    title,
    context,
    arrow,
    info,
    openMessageInPlg,
    createFolder,
    deleteFolder,
    deleteMsg,
  }) => {
    // console.log({ title });
    const renderDepthOffset = 8;
    const InteractiveComponent = context.isRenaming ? 'div' : 'button';
    const type = context.isRenaming ? undefined : 'button';
    const isFolder = item.data.__ref.isFolder;
    const isItem = item.data.__ref.isItem;
    // console.log(item.data, 'item.data....');
    // TODO have only root li component create all the classes
    const style = isFolder //item.isFolder
      ? {
          paddingLeft: `${
            (depth + 1) * renderDepthOffset + depth * renderDepthOffset
          }px`,
        }
      : {
          marginLeft: `${(depth + 1) * 2 * renderDepthOffset - 4}px`,
          paddingLeft: `${renderDepthOffset}px`,
        };
    return (
      <li
        {...(context.itemContainerWithChildrenProps as any)}
        className={cx(
          'relative',
          { 'message-node': !isFolder },
          'rct-tree-item-li',
          { 'rct-tree-item-li-isFolder': isFolder },
          { 'rct-tree-item-li-selected': context.isSelected },
          { 'rct-tree-item-li-expanded': context.isExpanded },
          { 'rct-tree-item-li-focused': context.isFocused },
          { 'rct-tree-item-li-dragging-over': context.isDraggingOver },
          { 'rct-tree-item-li-search-match': context.isSearchMatching }
        )}
      >
        <div
          {...(context.itemContainerWithoutChildrenProps as any)}
          style={style}
          className={cx(
            'pr-2 mr-1 border border-app-border',
            'rct-tree-item-title-container opacity-80',
            { 'rct-tree-item-title-container-isFolder': isFolder },
            {
              'rct-tree-item-title-container-selected !opacity-100':
                context.isSelected,
            },
            {
              'rct-tree-item-title-container-expanded !opacity-100':
                context.isExpanded,
            },
            {
              'rct-tree-item-title-container-focused !opacity-100':
                context.isFocused,
            },
            {
              'rct-tree-item-title-container-dragging-over':
                context.isDraggingOver,
            },
            {
              'rct-tree-item-title-container-search-match':
                context.isSearchMatching,
            }
          )}
        >
          {context.isExpanded && isFolder && (
            <span
              className="rct-tree-line absolute top-5 bottom-0 border-r border-app-foreground-inactive z-10 opacity-50"
              style={{ paddingLeft: `${renderDepthOffset - 3}px` }}
            ></span>
          )}
          {isFolder && (
            <span
              className={cx(
                'rct-tree-line horizontal absolute top-3 h-px bg-app-foreground-inactive z-10 w-2 opacity-50',
                { '!top-4': item.data.__ref.isRequest }
              )}
              style={{
                left: `${renderDepthOffset * (depth + (depth - 1)) + 6}px`,
              }}
            ></span>
          )}
          {!isFolder && (
            <span
              className={cx(
                'rct-tree-line horizontal absolute top-3 h-px bg-app-foreground-inactive z-10 w-2 opacity-50',
                { '!top-4': item.data.__ref.isRequest }
              )}
              style={{
                left: `${renderDepthOffset * (depth + (depth - 1)) + 6}px`,
              }}
            ></span>
          )}
          {arrow}
          <InteractiveComponent
            type={type}
            {...(context.interactiveElementProps as any)}
            className={cx(
              'whitespace-pre overflow-hidden text-ellipsis rct-tree-item-button !h-fit	!block',
              { 'rct-tree-item-button-isFolder': isFolder },
              { 'rct-tree-item-button-selected': context.isSelected },
              { 'rct-tree-item-button-expanded': context.isExpanded },
              { 'rct-tree-item-button-focused': context.isFocused },
              { 'rct-tree-item-button-dragging-over': context.isDraggingOver },
              { 'rct-tree-item-button-search-match': context.isSearchMatching }
            )}
          >
            {item.data.__ref.isFolder ? (
              <span className="w-full overflow-hidden text-ellipsis items-center block">
                {title}
              </span>
            ) : (
              <div>
                <div className="w-full overflow-hidden text-ellipsis items-center block">
                  {title}
                  {/* <span className="bg-focus2 text-xs px-1 !mx-1">{'tag'}</span> */}
                </div>
                <div
                  className="text-sm app-foreground-inactive"
                  style={{ maxHeight: '70px' }}
                >
                  {item.data.value}
                </div>
              </div>
            )}
          </InteractiveComponent>
          <div className="flex ml-auto rct-tree-item-li-action items-center">
            {isItem ? (
              <Button
                text={'Open'}
                {...context.interactiveElementProps}
                onClick={(e) => {
                  // e.preventDefault();
                  // e.stopPropagation();
                  context.focusItem(item.data.__ref.id);
                  openMessageInPlg(item.data.__ref.id);
                }}
                size='compact-xs'
                ghost
              />
            ) : (
              <></>
            )}

            {item.data.__ref.isFolder ? (
              <Plus
                className="ml-1 cursor-pointer"
                tabIndex={2}
                size={14}
                onClick={() => {
                  createFolder(item.index);
                }}
              />
            ) : (
              <></>
            )}

            <Trash2
              className="ml-1 cursor-pointer"
              size={14}
              onClick={() => {
                if (item.data.__ref.isFolder) deleteFolder(item.index);
                else deleteMsg(item.index);
              }}
              tabIndex={2}
            />
          </div>
        </div>
        {children}
      </li>
    );
  },
};
