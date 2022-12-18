import { IRequestFolder, TId, IWebSocketMessage } from '@firecamp/types';
import mitt from 'mitt';
import {
  Disposable,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from '@firecamp/ui-kit/src/tree';

enum ETreeEventTypes {
  itemChanged = 'itemChanged',
}
type TTreeItemData = {
  name: string;
  __ref: {
    id: string;
    collectionId?: string;
    isFolder?: boolean;
    isItem?: boolean;
  };
};
type TItemExtra_meta = {
  //todo: ts improvement needed
  __ref?: {
    isFolder?: boolean;
    isItem?: boolean;
  };
};

type TFolderItem = Partial<IRequestFolder & TItemExtra_meta>;
type TItem = Partial<IWebSocketMessage & TItemExtra_meta>;
type TCItem = TFolderItem | TItem;

export class CollectionTreeDataProvider<T = TTreeItemData>
  implements TreeDataProvider
{
  private items: Array<TCItem>;
  private rootOrders: TreeItemIndex[];
  private emitter = mitt();

  constructor(folders: TFolderItem[], items: TItem[], rootOrders: string[]) {
    this.init(folders, items, rootOrders);
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

    let item = this.items.find((i) => i.__ref?.id == itemId);

    console.log(this.items, itemId);

    let treeItem: TTreeItemData = {
      name: item.name,
      __ref: {
        id: item.__ref.id,
        isFolder: item.__ref.isFolder,
        collectionId: item.__ref?.collectionId,
      },
    };

    let getChildren = (item) => {
      if (item.__ref.isLeaf) return [];
      return this.items
        .filter((i) => {
          if (item.__ref.isFolder) return i.__ref.folderId == item.__ref.id;
          return true;
        })
        .map((i) => i.__ref.id);
    };

    let children = getChildren(item);
    return Promise.resolve({
      index: item.__ref.id,
      canMove: true,
      data: treeItem,
      canRename: true,
      isFolder: item.__ref.isFolder,
      children,
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

  public init(folders: TFolderItem[], items: TItem[], rootOrders: string[]) {
    this.items = [
      ...folders.map((i) => ({
        ...i,
        __ref: { ...i.__ref, isFolder: true },
      })),
      ...items.map((i) => ({ ...i, __ref: { ...i.__ref, isItem: true } })),
    ];
    // this.rootOrders = this.items
    //   .filter((i) => !i.__ref.folderId)
    //   .map((i) => i.__ref.id);
    this.rootOrders = rootOrders;
  }

  // extra methods of provider
  public addFolder(item: TFolderItem) {
    console.log(item, 8855888);
    this.items.push({ ...item, __ref: { ...item.__ref, isFolder: true } });
    if (!item.__ref.folderId) {
      this.rootOrders.push(item.__ref.id);
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    } else {
      this.emitter.emit(ETreeEventTypes.itemChanged, [item.__ref.folderId]);
    }
  }

  public addItem(item: TItem) {
    this.items.push({ ...item, __ref: { ...item.__ref, isItem: true } });
    if (!item.__ref.folderId) {
      this.rootOrders.push(item.__ref.id);
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    } else {
      this.emitter.emit(ETreeEventTypes.itemChanged, [item.__ref.folderId]);
    }
  }

  public updateItem(item: TItem) {
    this.items = this.items.map((itm: TItem) => {
      if (itm.__ref.id == item.__ref.id) {
        // if only name is updated then even this will work, or full payload. just merging updated item with previous item
        return {
          ...itm,
          ...item,
          __ref: { ...itm.__ref, ...item.__ref, isItem: true },
        };
      }
      return itm;
    });

    if (!item.__ref.folderId) {
      this.rootOrders.push(item.__ref.id);
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    } else {
      this.emitter.emit(ETreeEventTypes.itemChanged, [item.__ref.folderId]);
    }
  }

  public deleteItem(id: TId) {
    const item = this.items.find((i) => i.__ref.id == id);

    console.log(id, item);
    if (!item) return;
    this.items = this.items.filter((i) => i.__ref.id != id);
    if (!item.__ref.folderId) {
      this.rootOrders = this.rootOrders.filter((i) => i != id);
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    } else {
      this.emitter.emit(ETreeEventTypes.itemChanged, [item.__ref.folderId]);
    }
  }
}
