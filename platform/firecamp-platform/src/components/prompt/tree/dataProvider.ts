import mitt from 'mitt';
import { IRequestFolder } from '@firecamp/types';
import { _array } from '@firecamp/utils';
import {
  Disposable,
  TreeDataProvider as _TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from '@firecamp/ui/src/tree';

enum ETreeEventTypes {
  itemChanged = 'itemChanged',
}
type TTreeItemData = {
  name: string;
  __ref: {
    id: string;
    collectionId?: string;
  };
};
type TFolderItem = Partial<IRequestFolder>;

export class TreeDataProvider<T = TTreeItemData> implements _TreeDataProvider {
  private items: TFolderItem[];
  private rootOrders: TreeItemIndex[];
  private emitter = mitt();

  constructor(folders: TFolderItem[], rootOrders: string[]) {
    this.init(folders, rootOrders);
  }

  public async getTreeItem(
    itemId: TreeItemIndex
  ): Promise<TreeItem<TTreeItemData>> {
    if (itemId == 'root') {
      return Promise.resolve({
        index: 'root',
        canMove: true,
        data: { name: 'Root', __ref: { id: 'root' } },
        canRename: false,
        isFolder: true,
        children: this.rootOrders,
      });
    }

    const item = this.items.find((i) => i.__ref?.id == itemId);
    // console.log(item, itemId);
    if (!item) {
      return {
        data: null,
        index: null,
      };
    }

    const treeItem: TTreeItemData = {
      name: item.name,
      __ref: {
        id: item.__ref.id,
        collectionId: item.__ref?.collectionId,
      },
    };

    return Promise.resolve({
      index: item.__ref.id,
      canMove: true,
      data: treeItem,
      canRename: true,
      isFolder: true,
      children: _array.uniq(item.__meta.fOrders || []),
    });
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ): Promise<void> {
    if (itemId == 'root') this.rootOrders = newChildren;
    else {
      this.items = this.items.map((i) => {
        return i.__ref.id == itemId ? { ...i, children: newChildren } : i;
      });
    }
    this.emitter.emit(ETreeEventTypes.itemChanged, [itemId]);
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void
  ): Disposable {
    // console.log(listener, "listener.....onDidChangeTreeData")
    const handler = (itemIDs: TreeItemIndex[]) => listener(itemIDs);
    this.emitter.on(ETreeEventTypes.itemChanged, handler);
    return {
      dispose: () => this.emitter.off(ETreeEventTypes.itemChanged, handler),
    };
  }

  public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {
    //todo: implement
  }

  public init(folders: TFolderItem[], rootOrders: string[]) {
    this.items = [
      ...folders.map((i) => ({
        ...i,
        __ref: { ...i.__ref },
      })),
    ];
    // this.rootOrders = this.items
    //   .filter((i) => !i.__ref.folderId)
    //   .map((i) => i.__ref.id);
    this.rootOrders = rootOrders;
  }

  // extra methods of provider
  public addFolder(item: TFolderItem) {
    this.items.push({ ...item });
    if (!item.__ref.folderId) {
      this.rootOrders.push(item.__ref.id);
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    } else {
      this.emitter.emit(ETreeEventTypes.itemChanged, [item.__ref.folderId]);
    }
  }
}
