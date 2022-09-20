import { IRequestFolder, IGraphQLPlayground, TId } from '@firecamp/types';
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
  _meta: {
    id: string;
    collection_id?: string;
    is_folder?: boolean;
    is_item?: boolean;
  };
};
type TItemExtra_meta = {
  //todo: ts improvement needed
  _meta?: {
    is_folder?: boolean;
    is_item?: boolean;
  };
};

type TFodlerItem = Partial<IRequestFolder & TItemExtra_meta>;
type TItem = Partial<IGraphQLPlayground & TItemExtra_meta>;
type TCItem = TFodlerItem | TItem;

export class CollectionTreeDataProvider<T = TTreeItemData>
  implements TreeDataProvider
{
  private items: Array<TCItem>;
  private rootOrders: TreeItemIndex[];
  private emitter = mitt();

  constructor(folders: Array<TFodlerItem>, items: Array<TItem>) {
    this.items = [
      ...folders.map((i) => ({
        ...i,
        _meta: { ...i._meta, is_folder: true },
      })),
      ...items.map((i) => ({ ...i, _meta: { ...i._meta, is_item: true } })),
    ];
    this.rootOrders = this.items
      .filter((i) => !i._meta.folder_id)
      .map((i) => i._meta.id);
  }

  public async getTreeItem(
    itemId: TreeItemIndex
  ): Promise<TreeItem<TTreeItemData>> {
    if (itemId == 'root') {
      return Promise.resolve({
        index: 'root',
        canMove: true,
        data: { name: 'Root', _meta: { id: 'root' } },
        canRename: false,
        hasChildren: true,
        children: this.rootOrders,
      });
    }

    let item = this.items.find((i) => i._meta?.id == itemId);

    console.log(this.items, itemId);

    let treeItem: TTreeItemData = {
      name: item.name,
      _meta: {
        id: item._meta.id,
        is_folder: item._meta.is_folder,
        collection_id: item._meta?.collection_id,
      },
    };

    let getChildren = (item) => {
      if (item._meta.is_leaf) return [];
      return this.items
        .filter((i) => {
          if (item._meta.is_folder)
            return i._meta.folder_id == item._meta.id;
          return true;
        })
        .map((i) => i._meta.id);
    };

    let children = getChildren(item);
    return Promise.resolve({
      index: item._meta.id,
      canMove: true,
      data: treeItem,
      canRename: true,
      hasChildren: item._meta.is_folder,
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
        return i._meta.id == itemId ? { ...i, children: newChildren } : i;
      });
    }
    this.emitter.emit(ETreeEventTypes.itemChanged, [itemId]);
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void
  ): Disposable {
    // console.log(listener, "listener.....onDidChangeTreeData")
    this.emitter.on(ETreeEventTypes.itemChanged, (itemIDs: TreeItemIndex[]) =>
      listener(itemIDs)
    );
    return { dispose: () => this.emitter.off(ETreeEventTypes.itemChanged) };
  }

  public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {
    //todo: implement
  }

  // extra methods of provider
  public addFolder(item: TFodlerItem) {
    this.items.push({ ...item, _meta: { ...item._meta, is_folder: true } });
    if (!item._meta.folder_id) {
      this.rootOrders.push(item._meta.id);
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    } else {
      this.emitter.emit(ETreeEventTypes.itemChanged, [item._meta.folder_id]);
    }
  }

  public addItem(item: TItem) {
    this.items.push({ ...item, _meta: { ...item._meta, is_item: true } });
    if (!item._meta.folder_id) {
      this.rootOrders.push(item._meta.id);
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    } else {
      this.emitter.emit(ETreeEventTypes.itemChanged, [item._meta.folder_id]);
    }
  }

  public updateItem(item: TItem) {
    this.items = this.items.map((itm: TItem)=> {
      if(itm._meta.id == item._meta.id) {
        // if only name is updated then even this will work, or full payload. just merging updated item with previous item
        return { ...itm, ...item,  _meta: { ...itm._meta, ...item._meta, is_item: true } }
      }
      return itm;
    });

    if (!item._meta.folder_id) {
      this.rootOrders.push(item._meta.id);
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    } else {
      this.emitter.emit(ETreeEventTypes.itemChanged, [item._meta.folder_id]);
    }
  }

  public deleteItem(id: TId) {
    const item = this.items.find((i) => i._meta.id == id);

    console.log(id, item);
    if (!item) return;
    this.items = this.items.filter((i) => i._meta.id != id);
    if (!item._meta.folder_id) {
      this.rootOrders = this.rootOrders.filter((i) => i != id);
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    } else {
      this.emitter.emit(ETreeEventTypes.itemChanged, [item._meta.folder_id]);
    }
  }
}
