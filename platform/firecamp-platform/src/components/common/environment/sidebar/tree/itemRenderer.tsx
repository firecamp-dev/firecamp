import cx from 'classnames';
// import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
// import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
// import { VscFolderOpened } from '@react-icons/all-files/vsc/VscFolderOpened';
import { VscTriangleRight } from '@react-icons/all-files/vsc/VscTriangleRight';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import { VscLock } from '@react-icons/all-files/vsc/VscLock';
import { AiTwotoneFolder } from '@react-icons/all-files/ai/AiTwotoneFolder';
import { AiTwotoneFolderOpen } from '@react-icons/all-files/ai/AiTwotoneFolderOpen';
import { VscJson } from '@react-icons/all-files/vsc/VscJson';
import { Button } from '@firecamp/ui';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';

export default {
  renderItemArrow: ({ item, context }) => {
    // console.log( item.data.__ref, "arrow context");
    if (item.data.__ref?.isCollection || item.data.__ref?.isWorkspace) {
      return context.isExpanded ? (
        <>
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
    } else if (item.data.__ref?.isEnvironment) {
      return (
        <>
          {/* {item.data.__meta.visibility == 2 ? (
            <VscLock className="mr-0.5 flex-none" size={18} opacity={1} />
          ) : (
            <></>
          )} */}
          <VscJson className="mr-0.5 flex-none" size={18} opacity={1} />
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
    openEnv,
    openCreateEnv,
    deleteEnv,
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
            paddingLeft: `${
              (depth + 1) * renderDepthOffset + depth * renderDepthOffset
            }px`,
          }}
          className={cx(
            'pr-2',
            'rct-tree-item-title-container',
            { 'rct-tree-item-title-container-isFolder': item.isFolder },
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
          {context.isExpanded && item.isFolder && (
            <span
              className="rct-tree-line absolute top-5 bottom-0 border-r border-app-foreground-inactive z-10 opacity-50"
              style={{ paddingLeft: `${renderDepthOffset - 3}px` }}
            ></span>
          )}
          <span
            className={cx(
              'rct-tree-line horizontal absolute top-3 h-px bg-app-foreground-inactive z-10 w-2 opacity-50',
              { '!top-4': item.data.__ref.isRequest }
            )}
            style={{ left: `${renderDepthOffset * 2 - 3}px` }}
          ></span>
          {arrow}
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
            <span className="w-full overflow-hidden text-ellipsis items-center block">
              {title}

              {item.data.__ref?.isCollection || item.data.__ref?.isWorkspace ? (
                <span className={'text-sm'}>- {item.children?.length}</span>
              ) : (
                <></>
              )}
            </span>
          </InteractiveComponent>
          <div className="flex ml-auto rct-tree-item-li-action items-center">
            {/* <VscJson size={14} className="ml-1" onClick={(e)=> {
                e.preventDefault()
                e.stopPropagation()
                openEnv(item.index);
                console.log(1234)
              }}/> */}

            {item.data.__ref.isEnvironment ? (
              <Button
                text={'Clone'}
                className="hover:!bg-focus2 ml-1 !text-app-foreground-inactive !py-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item.data.__ref?.isCollection || item.data.__ref?.isWorkspace
                    ? () => {} //openCreateEnv(item.index)
                    : openEnv(
                        item.data.__ref.collectionId ||
                          item.data.__ref?.workspaceId,
                        item.data.__ref.id
                      );
                }}
                transparent
                secondary
                ghost
                sm
              />
            ) : (
              <></>
            )}

            {/* {item.data.__ref.isEnvironment ? (
              <VscTrash
                className="ml-1 cursor-pointer"
                size={14}
                onClick={() => {
                  deleteEnv(item.index);
                }}
              />
            ) : (
              <></>
            )} */}
          </div>
        </div>
        {children}
      </li>
    );
  },
};
