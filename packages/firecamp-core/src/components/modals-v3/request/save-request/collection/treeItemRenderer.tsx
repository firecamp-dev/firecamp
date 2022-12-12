import cx from 'classnames';
import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
import { VscFolderOpened } from '@react-icons/all-files/vsc/VscFolderOpened';
import { VscFolder } from '@react-icons/all-files/vsc/VscFolder';

export default {
  renderItemArrow: ({ item, context }) => {
    // console.log( info, "arrow context");
    if (item.data.__ref?.isRequest) {
      return (
        <div
          className={cx(
            item.data?.icon?.text,
            'collection_leaf-node-type pl-2'
          )}
        >
          {item.data?.icon?.text}
        </div>
      );
    } else if (item.data.__ref?.isCollection) {
      return context.isExpanded ? (
        <VscChevronDown size={20} />
      ) : (
        <VscChevronRight size={20} />
      );
    } else if (item.data.__ref?.isFolder) {
      return context.isExpanded ? (
        <>
          <VscChevronDown size={20} />
          <VscFolderOpened size={20} />
        </>
      ) : (
        <>
          <VscChevronRight size={20} /> <VscFolder size={20} />
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
              className="rct-tree-line absolute top-4 bottom-0 border-r border-appForegroundInActive z-10"
              style={{ paddingLeft: `${renderDepthOffset}px` }}
            ></span>
          )}
          {arrow}
          <InteractiveComponent
            type={type}
            {...(context.interactiveElementProps as any)}
            className={cx(
              'pl-1 rct-tree-item-button',
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
        </div>
        {children}
      </li>
    );
  },
};
