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
    is_collection?: boolean;
    is_folder?: boolean;
    collection_id?: string; // exist in folder and request
    folder_id?: string; // exist in folder/request
  };
};
export class CollectionDataProvider<T = any> implements TreeDataProvider {
  private items: any; //ExplicitDataSource;
  private rootOrders: TreeItemIndex[];
  // private onDidChangeTreeDataEmitter = new EventEmitter<TreeItemIndex[]>();
  private emitter = mitt();

  constructor(
    collections: any[] = [],
    folders: any[] = []
    // items: Record<TreeItemIndex, TreeItem<T>>,
    // private implicitItemOrdering?: (itemA: TreeItem<T>, itemB: TreeItem<T>) => number,
  ) {
    this.items = [
      ...collections.map((i) => ({
        ...i,
        _meta: { ...i._meta, is_collection: true },
      })),
      ...folders.map((i) => ({ ...i, _meta: { ...i._meta, is_folder: true } })),
    ];
    this.rootOrders = collections.map((i) => i._meta.id);
  }

  public async getTreeItem(
    itemId: TreeItemIndex
  ): Promise<TreeItem<TTreeItemData>> {
    if (itemId == 'root') {
      // console.log(this.rootOrders, "this.rootOrders...")
      return Promise.resolve({
        index: 'root',
        canMove: true,
        data: { name: 'Root', _meta: { id: 'root', is_collection: true } },
        canRename: false,
        hasChildren: !!this.rootOrders?.length,
        children: this.rootOrders,
      });
    }

    const item = this.items.find((i) => i._meta?.id == itemId);

    // console.log(item, itemId, 12)

    let treeItem: TTreeItemData = {
      name: item.name,
      _meta: {
        id: item._meta.id,
        collection_id: item._meta?.collection_id,
        folder_id: item._meta?.folder_id || item._meta?.parent_id,
      },
    };
    if (item._meta?.is_collection == true) treeItem._meta.is_collection = true;
    if (item._meta?.is_folder == true) treeItem._meta.is_folder = true;

    let children = [...item?.meta?.f_orders];
    return Promise.resolve({
      index: item._meta.id,
      canMove: true,
      data: treeItem,
      canRename: true,
      hasChildren: !!children?.length,
      children,
    });
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ): Promise<void> {
    // this.items[itemId].children = newChildren;

    if (itemId == 'root') this.rootOrders = newChildren;
    else {
      console.log(itemId, newChildren, 'onChangeItemChildren...');
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
    this.items = this.items.map((i) => {
      if (i._meta.id == item.index) {
        // request will have name in meta while other items will have name key at root
        return !!i.name ? { ...i, name } : { ...i, meta: { ...i.meta, name } };
      }
      return i;
    });
  }
}
