import mitt from 'mitt';
import {
  Disposable,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from '@firecamp/ui-kit/src/tree';
import { useWorkspaceStore } from '../../../store/workspace';

enum ETreeEventTypes {
  itemChanged = 'itemChanged',
}
type TTreeItemData = {
  name: string;
  icon?: { text?: string };
  _meta: {
    id: string;
    is_collection?: boolean;
    is_folder?: boolean;
    is_request?: boolean;
    collection_id?: string; // exist in folder and request
    folder_id?: string;
  };
};

//@ts-ignore
const _uniq = (arr: string[]) => [...new Set(arr)];
export class WorkspaceCollectionsProvider<T = any> implements TreeDataProvider {
  private items: any[]; //ExplicitDataSource;
  private rootOrders: TreeItemIndex[];
  // private onDidChangeTreeDataEmitter = new EventEmitter<TreeItemIndex[]>();
  private emitter = mitt();

  constructor(
    collections: any[] = [],
    folders: any[] = [],
    requests: any[] = [],
    rootOrders: string[] = []
    // items: Record<TreeItemIndex, TreeItem<T>>,
    // private implicitItemOrdering?: (itemA: TreeItem<T>, itemB: TreeItem<T>) => number,
  ) {
    this.items = [
      ...collections.map((i) => ({
        ...i,
        _meta: { ...i._meta, is_collection: true },
      })),
      ...folders.map((i) => ({ ...i, _meta: { ...i._meta, is_folder: true } })),
      ...requests.map((i) => ({
        ...i,
        _meta: { ...i._meta, is_request: true },
      })),
    ];
    // console.log(rootOrders, 'rootOrders...');
    this.rootOrders = rootOrders;
  }

  public async getTreeItem(
    itemId: TreeItemIndex
  ): Promise<TreeItem<TTreeItemData>> {
    if (itemId == 'root') {
      return Promise.resolve({
        index: 'root',
        canMove: true,
        data: { name: 'Root', _meta: { id: 'root', is_collection: true } },
        canRename: false,
        hasChildren: true,
        children: this.rootOrders,
      });
    }

    let item = this.items.find((i) => i._meta?.id == itemId);
    if (!item) return Promise.resolve({ index: null, data: null });
    // return Promise.reject(
    //   "The item id is existing in parent's meta orders array but can't find the item in data provider's items array"
    // );

    let treeItem: TTreeItemData = {
      name: item.name || item.meta.name, // in request, the `name` key will be in `meta`
      icon: { text: item?.method || undefined },
      _meta: {
        id: item._meta.id,
        collection_id: item._meta?.collection_id,
        folder_id: item._meta?.folder_id,
      },
    };
    if (item._meta?.is_collection == true) treeItem._meta.is_collection = true;
    if (item._meta?.is_folder == true) treeItem._meta.is_folder = true;
    if (item._meta?.is_request == true) treeItem._meta.is_request = true;

    const children = _uniq([
      ...(item.meta.f_orders || []),
      ...(item.meta.r_orders || []),
    ]);
    return Promise.resolve({
      index: item._meta.id,
      canMove: true,
      data: treeItem,
      canRename: true,
      hasChildren: !treeItem._meta.is_request, //!!children?.length, //note: if it's false then folder click has no effect, we need to open it even it's empty
      children,
    });
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ): Promise<void> {
    // this.items[itemId].children = newChildren;

    const {
      changeWorkspaceMetaOrders,
      changeCollectionMetaOrders,
      changeFolderMetaOrders,
    } = useWorkspaceStore.getState();

    if (itemId == 'root') {
      this.rootOrders = newChildren;
      changeWorkspaceMetaOrders(newChildren as string[]);
    } else {
      // split new children into f_orders and r_orders
      const { f_orders, r_orders } = newChildren.reduce(
        (p, n) => {
          const item = this.items.find((i) => i._meta.id == n);
          if (item && item._meta.is_folder)
            return { f_orders: [...p.f_orders, n], r_orders: p.r_orders };
          else if (item && item._meta.is_request)
            return { f_orders: p.f_orders, r_orders: [...p.r_orders, n] };
          else return p;
        },
        { f_orders: [], r_orders: [] }
      );

      this.items = this.items.map((i) => {
        if (i._meta.id == itemId) {
          if (i._meta.is_collection)
            changeCollectionMetaOrders(itemId as string, {
              f_orders,
              r_orders,
            });
          if (i._meta.is_folder)
            changeFolderMetaOrders(itemId as string, { f_orders, r_orders });
          return { ...i, meta: { ...i.meta, f_orders, r_orders } };
        }
        return i;
      });
    }
    setTimeout(() => {
      this.emitter.emit(ETreeEventTypes.itemChanged, [itemId]);
    });
    return Promise.resolve();
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void
  ): Disposable {
    // console.log(listener, 'listener.....onDidChangeTreeData');
    this.emitter.on(
      ETreeEventTypes.itemChanged,
      (changedItemIds: TreeItemIndex[]) => {
        return listener(changedItemIds);
      }
    );
    return {
      dispose: () => {
        this.emitter.off(ETreeEventTypes.itemChanged);
      },
    };
  }

  public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {
    this.items = this.items.map((i) => {
      if (i._meta.id == item.index) {
        // request will have name in meta while other items will have name key at root
        return !!i.name ? { ...i, name } : { ...i, meta: { ...i.meta, name } };
      }
      return i;
    });
    // if (this.setItemName) {
    //   this.items[item.index] = this.setItemName(item, name);
    //   // this.onDidChangeTreeDataEmitter.emit(item.index);
    // }
  }

  // extra methods of provider
  init(
    collections: any[] = [],
    folders: any[] = [],
    requests: any[] = [],
    rootOrders: string[] = []
  ) {
    this.items = [
      ...collections.map((i) => ({
        ...i,
        _meta: { ...i._meta, is_collection: true },
      })),
      ...folders.map((i) => ({ ...i, _meta: { ...i._meta, is_folder: true } })),
      ...requests.map((i) => ({
        ...i,
        _meta: { ...i._meta, is_request: true },
      })),
    ];
    this.rootOrders = rootOrders;
    setTimeout(() => {
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    });
  }

  public addCollectionItem(item: any) {
    this.items.push({ ...item, _meta: { ...item._meta, is_collection: true } });
    this.rootOrders.push(item._meta.id);
    this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
  }

  public addFolderItem(item: any) {
    this.items.push({ ...item, _meta: { ...item._meta, is_folder: true } });
    this.items.map((i) => {
      if (item._meta.folder_id && i._meta.id == item._meta.folder_id) {
        i.meta.f_orders.push(item._meta.id);
      } else if (
        item._meta.collection_id &&
        i._meta.id == item._meta.collection_id
      ) {
        i.meta.f_orders.push(item._meta.id);
      }
      return i;
    });
    this.emitter.emit(ETreeEventTypes.itemChanged, [
      item._meta.folder_id || item._meta.collection_id,
    ]);
  }

  public addRequestItem(item: any) {
    this.items.push({ ...item, _meta: { ...item._meta, is_request: true } });
    this.items.map((i) => {
      if (item._meta.folder_id && i._meta.id == item._meta.folder_id) {
        i.meta.r_orders.push(item._meta.id);
      } else if (
        item._meta.collection_id &&
        i._meta.id == item._meta.collection_id
      ) {
        i.meta.r_orders.push(item._meta.id);
      }
      return i;
    });
    this.emitter.emit(ETreeEventTypes.itemChanged, [
      item._meta.folder_id || item._meta.collection_id,
    ]);
  }
}
