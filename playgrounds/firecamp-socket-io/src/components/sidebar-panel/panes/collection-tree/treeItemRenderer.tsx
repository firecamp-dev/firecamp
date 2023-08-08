import cx from 'classnames';
import { FolderOpen, FolderClosed, Plus, Trash2 } from 'lucide-react';
import { VscTriangleRight } from '@react-icons/all-files/vsc/VscTriangleRight';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import { Button } from '@firecamp/ui';
import { ISocketIOEmitter } from '@firecamp/types';

export default {
  renderItemArrow: ({ item, context }) => {
    console.log(item, 'arrow context');

    if (item.data?.__ref?.isItem) {
      // return <div className={cx('collection_leaf-node-type')}>Emt.</div>;
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
          <FolderClosed
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
    openEmitterInPlg,
    deleteFolder,
    deleteEmitter,
    createFolder,
  }) => {
    const renderDepthOffset = 8;
    const InteractiveComponent = context.isRenaming ? 'div' : 'button';
    const type = context.isRenaming ? undefined : 'button';

    const { argsCount, previewText } = getEmitterArgPreview(item.data);

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
            'rct-tree-item-title-container opacity-80',
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
              'pl-1 whitespace-pre overflow-hidden text-ellipsis rct-tree-item-button !h-fit !block',
              { 'rct-tree-item-button-isFolder': item.isFolder },
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
                </div>
                {/* <div className="bg-focus2- text-sm text-ellipsis">
                  {item.data.__meta?.label} Firecamp Label
                </div> */}
                <div className="text-sm app-foreground-inactive">
                  {previewText || ''}
                </div>
              </div>
            )}
          </InteractiveComponent>
          <div className="flex ml-auto rct-tree-item-li-action items-center">
            {item.data.__ref.isItem ? (
              <Button
                text={'Open'}
                {...context.interactiveElementProps}
                onClick={(e) => {
                  // e.preventDefault();
                  // e.stopPropagation();
                  context.focusItem(item.data.__ref.id);
                  openEmitterInPlg(item.data.__ref.id);
                }}
                ghost
                compact
                xs
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
                if (item.isFolder) deleteFolder(item.index);
                else deleteEmitter(item.index);
              }}
            />
          </div>
        </div>
        {children}
      </li>
    );
  },
};

const getEmitterArgPreview = (item: ISocketIOEmitter) => {
  const { name, value } = item;
  const argsCount = value?.length || 0;
  const arg = argsCount ? value[0] : { body: '' };
  const body = '' + arg.body;
  return { argsCount, previewText: body };
};
