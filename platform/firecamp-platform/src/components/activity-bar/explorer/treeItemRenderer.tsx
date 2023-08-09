import cx from 'classnames';
import { FolderOpen, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import CollectionMenu from './menus/CollectionMenu';
import {
  FcIconGraphQL,
  FcIconSocketIoSquare,
  FcIconWebSocket,
} from '@firecamp/ui';
import { ERequestTypes } from '@firecamp/types';

export default {
  renderItemArrow: ({ item, context }) => {
    // console.log(item, 'arrow context');

    if (item.data?.__ref?.isRequest) {
      const { type = null, method = '' } = item.data?.__meta;
      switch (type) {
        case ERequestTypes.Rest:
          const text = method.toUpperCase();
          return (
            <div className={cx(text, 'collection_leaf-node-type')} {...context.arrowProps}>{text}</div>
          );
        case ERequestTypes.GraphQL:
          return <FcIconGraphQL className="text-graphql" size={24}  {...context.arrowProps} />;
        case ERequestTypes.WebSocket:
          return <FcIconWebSocket className="" size={24} {...context.arrowProps} />;
        case ERequestTypes.SocketIO:
          return <FcIconSocketIoSquare className="" size={24} {...context.arrowProps} />;
        default:
          return <></>;
      }
    } else if (item.data?.__ref?.isCollection) {
      return context.isExpanded ? (
        <div className='flex items-center' {...context.arrowProps}>
          <ChevronDown className="mr-1 flex-none" size={16} opacity={0.8} />
        </div>
      ) : (
        <div className='flex items-center' {...context.arrowProps}>
          <ChevronRight className="mr-1 flex-none" size={16} opacity={0.8} />
        </div>
      );
    } else if (item.data?.__ref?.isFolder) {
      return context.isExpanded ? (
        <div className='flex items-center' {...context.arrowProps}>
          <ChevronDown className="mr-1 flex-none" size={16} opacity={0.8} />
          <FolderOpen className="mr-1 flex-none" size={16} opacity={0.6} />
        </div>
      ) : (
        <div className='flex items-center' {...context.arrowProps}>
          <ChevronRight className="mr-1 flex-none" size={16} opacity={0.8} />
          <Folder className="mr-1 flex-none" size={16} opacity={0.6} />
        </div>
      );
    } else {
      return <></>;
    }

  },

  renderItemTitle: ({ title, context, info }) => {
    // console.log(title, 'title...');
    if (!info.isSearching || !context.isSearchMatching) {
      return <>{title}</>;
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
    treeRef,
  }) => {
    const _startRenaming = () => {
      // context.startRenamingItem(item.index);
      treeRef?.current.startRenamingItem(item.index);
      // console.log(item, treeRef, context, "... _startRenaming")
      // context.startRenamingItem() //this api is not working here: https://github.com/lukasbach/react-complex-tree/issues/83
    };

    const renderDepthOffset = 8;
    const InteractiveComponent = context.isRenaming ? 'div' : 'button';
    const type = context.isRenaming ? undefined : 'button';
    // TODO have only root li component create all the classes
    return (
      <li
        {...(context.itemContainerWithChildrenProps as any)}
        className={cx(
          'relative',
          'rct-tree-item-li',
          { 'rct-tree-item-li-isFolder': item.isFolder },
          { 'rct-tree-item-li-selected': context.isSelected },
          { 'rct-tree-item-li-expanded': context.isExpanded },
          { 'rct-tree-item-li-focused': context.isFocused },
          { 'rct-tree-item-li-dragging-over': context.isDraggingOver },
          { 'rct-tree-item-li-search-match': context.isSearchMatching }
        )}
      >
        <div
          {...(context.itemContainerWithoutChildrenProps as any)}
          style={{
            paddingLeft: `${(depth + 1) * renderDepthOffset + depth * renderDepthOffset
              }px`,
          }}
          className={cx(
            'pr-2',
            'rct-tree-item-title-container',
            { 'rct-tree-item-title-container-isFolder': item.isFolder },
            {
              'rct-tree-item-title-container-selected': context.isSelected,
            },
            {
              'rct-tree-item-title-container-expanded': context.isExpanded,
            },
            {
              'rct-tree-item-title-container-focused': context.isFocused,
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
          {context.isExpanded && item.isFolder && (
            <span
              className="rct-tree-line absolute top-5 bottom-0 border-r border-app-foreground-inactive z-10 opacity-50"
              style={{ paddingLeft: `${renderDepthOffset + 3}px` }}
            ></span>
          )}
          <span
            className={cx(
              'rct-tree-line horizontal absolute top-3 h-px bg-app-foreground-inactive z-10 w-2 opacity-50',
              { '!top-auto': item.data?.__ref.isRequest }
            )}
            style={{ left: `${renderDepthOffset * 2 + 3}px` }}
          ></span>

          <InteractiveComponent
            type={type}
            {...(context.interactiveElementProps as any)}
            className={cx(
              'pl-1 whitespace-pre overflow-hidden text-ellipsis rct-tree-item-button',
              { 'rct-tree-item-button-isFolder': item.isFolder },
              { 'rct-tree-item-button-selected': context.isSelected },
              { 'rct-tree-item-button-expanded': context.isExpanded },
              { 'rct-tree-item-button-focused': context.isFocused },
              { 'rct-tree-item-button-dragging-over': context.isDraggingOver },
              { 'rct-tree-item-button-search-match': context.isSearchMatching }
            )}
          >
            {arrow}
            <span
              className={cx(
                'pr-2',
                'w-full overflow-hidden text-ellipsis opacity-80',
                {
                  '!opacity-100': context.isSelected,
                },
                {
                  '!opacity-100': context.isExpanded,
                },
                {
                  '!opacity-100': context.isFocused,
                }
              )}
            >
              {title}
            </span>
          </InteractiveComponent>

          <CollectionMenu
            startRenaming={_startRenaming}
            collectionId={
              item.data?.__ref.isCollection
                ? item.data.__ref?.id
                : item.data?.__ref?.collectionId
            }
            folderId={
              item.data?.__ref.isFolder
                ? item.data?.__ref?.id
                : item.data?.__ref?.folderId
            }
            requestId={item.data?.__ref.isRequest ? item.data.__ref?.id : null}
            menuType={
              item.data?.__ref.isFolder
                ? 'folder'
                : item.data?.__ref.isCollection
                  ? 'collection'
                  : 'request'
            }
          />
        </div>
        {children}
      </li>
    );
  },
};
