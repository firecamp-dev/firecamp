import cx from 'classnames';
// import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
// import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
import { VscTriangleRight } from '@react-icons/all-files/vsc/VscTriangleRight';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import { VscFolderOpened } from '@react-icons/all-files/vsc/VscFolderOpened';
import { VscFolder } from '@react-icons/all-files/vsc/VscFolder';
import { AiTwotoneFolder } from '@react-icons/all-files/ai/AiTwotoneFolder';
import { AiTwotoneFolderOpen } from '@react-icons/all-files/ai/AiTwotoneFolderOpen';

import CollectionMenu from './menus/CollectionMenu';

export default {
  renderItemArrow: ({ item, context }) => {
    // console.log( info, "arrow context");
    if (item.data.__ref?.isRequest) {
      const text = item.data?.icon?.text?.toUpperCase();
      return (
        <div className={cx(text, 'collection_leaf-node-type pl-2')}>{text}</div>
      );
    } else if (item.data.__ref?.isCollection) {
      return context.isExpanded ? (
        <>
          {/* <VscChevronDown className="mr-1" size={20}/> */}
          <VscTriangleDown
            className="mr-1 flex-none"
            size={12}
            opacity={'0.6'}
          />
          <AiTwotoneFolderOpen
            className="mr-1 flex-none"
            size={16}
            opacity={'0.6'}
          />
        </>
      ) : (
        <>
          {/* <VscChevronRight className="mr-1" size={20}/> */}
          <VscTriangleRight
            className="mr-1 flex-none"
            size={12}
            opacity={'0.6'}
          />
          <AiTwotoneFolder
            className="mr-1 flex-none"
            size={16}
            opacity={'0.6'}
          />
        </>
      );
    } else if (item.data.__ref?.isFolder) {
      return context.isExpanded ? (
        <>
          {/* <VscChevronDown className="mr-1" size={20} opacity={'0.8'}/> */}
          <VscTriangleDown
            className="mr-1 flex-none"
            size={12}
            opacity={'0.6'}
          />
          <VscFolderOpened
            className="mr-1 flex-none"
            size={16}
            opacity={'0.8'}
          />
        </>
      ) : (
        <>
          {/* <VscChevronRight className="mr-1" size={20} opacity={'0.8'}/> */}
          <VscTriangleRight
            className="mr-1 flex-none"
            size={12}
            opacity={'0.6'}
          />
          <VscFolder
            className="mr-1 opacity-80 flex-none"
            size={16}
            opacity={'0.8'}
          />
        </>
      );
    } else {
      return <></>;
    }
  },

  renderItemTitle: ({ title, context, info }) => {
    console.log(title, 'title...');
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
    let _startRenaming = () => {
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
          item.isFolder && 'rct-tree-item-li-isFolder',
          context.isSelected && 'rct-tree-item-li-selected',
          context.isExpanded && 'rct-tree-item-li-expanded',
          context.isFocused && 'rct-tree-item-li-focused',
          context.isDraggingOver && 'rct-tree-item-li-dragging-over',
          context.isSearchMatching && 'rct-tree-item-li-search-match'
        )}
      >
        <div
          {...(context.itemContainerWithoutChildrenProps as any)}
          style={{
            paddingLeft: `${
              (depth + 1) * renderDepthOffset + depth * renderDepthOffset
            }px`,
          }}
          className={cx(
            'pr-2',
            'rct-tree-item-title-container',
            item.isFolder && 'rct-tree-item-title-container-isFolder',
            context.isSelected && 'rct-tree-item-title-container-selected',
            context.isExpanded && 'rct-tree-item-title-container-expanded',
            context.isFocused && 'rct-tree-item-title-container-focused',
            context.isDraggingOver &&
              'rct-tree-item-title-container-dragging-over',
            context.isSearchMatching &&
              'rct-tree-item-title-container-search-match'
          )}
        >
          {context.isExpanded && item.isFolder && (
            <span
              className="rct-tree-line absolute top-5 bottom-0 border-r border-appForegroundInActive z-10 opacity-50"
              style={{ paddingLeft: `${renderDepthOffset - 3}px` }}
            ></span>
          )}
          <span
            className={cx(
              'rct-tree-line horizontal absolute top-3 h-px bg-appForegroundInActive z-10 w-2 opacity-50',
              { '!top-4': item.data.__ref.isRequest }
            )}
            style={{ left: `${renderDepthOffset * 2 - 3}px` }}
          ></span>
          {arrow}
          <InteractiveComponent
            type={type}
            {...(context.interactiveElementProps as any)}
            className={cx(
              'pl-1 whitespace-pre overflow-hidden overflow-ellipsis rct-tree-item-button',
              item.isFolder && 'rct-tree-item-button-isFolder',
              context.isSelected && 'rct-tree-item-button-selected',
              context.isExpanded && 'rct-tree-item-button-expanded',
              context.isFocused && 'rct-tree-item-button-focused',
              context.isDraggingOver && 'rct-tree-item-button-dragging-over',
              context.isSearchMatching && 'rct-tree-item-button-search-match'
            )}
          >
            <span className="w-full overflow-hidden overflow-ellipsis">
              {title}
            </span>
          </InteractiveComponent>

          <CollectionMenu
            startRenaming={_startRenaming}
            collectionId={
              item.data.__ref.isCollection
                ? item.data.__ref?.id
                : item.data.__ref?.collectionId
            }
            folderId={
              item.data.__ref.isFolder
                ? item.data.__ref?.id
                : item.data.__ref?.folderId
            }
            requestId= {item.data.__ref.isRequest? item.data.__ref?.id: null}
            menuType={
              item.data.__ref.isFolder
                ? 'folder'
                : item.data.__ref.isCollection
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
