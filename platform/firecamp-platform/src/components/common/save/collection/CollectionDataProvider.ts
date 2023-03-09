import mitt from 'mitt';
import {
  Disposable,
  TreeDataProvider,
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
    isCollection?: boolean;
    isFolder?: boolean;
    collectionId?: string; // exist in folder and request
    folderId?: string; // exist in folder/request
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
        __ref: { ...i.__ref, isCollection: true },
      })),
      ...folders.map((i) => ({ ...i, __ref: { ...i.__ref, isFolder: true } })),
    ];
    this.rootOrders = collections.map((i) => i.__ref.id);
  }

  public async getTreeItem(
    itemId: TreeItemIndex
  ): Promise<TreeItem<TTreeItemData>> {
    if (itemId == 'root') {
      // console.log(this.rootOrders, "this.rootOrders...")
      return Promise.resolve({
        index: 'root',
        canMove: true,
        data: { name: 'Root', __ref: { id: 'root', isCollection: true } },
        canRename: false,
        isFolder: !!this.rootOrders?.length,
        children: this.rootOrders,
      });
    }

    const item = this.items.find((i) => i.__ref?.id == itemId);

    // console.log(item, itemId, 12)

    let treeItem: TTreeItemData = {
      name: item.name,
      __ref: {
        id: item.__ref.id,
        collectionId: item.__ref?.collectionId,
        folderId: item.__ref?.folderId,
      },
    };
    if (item.__ref?.isCollection == true) treeItem.__ref.isCollection = true;
    if (item.__ref?.isFolder == true) treeItem.__ref.isFolder = true;

    let children = [...item?.__meta?.fOrders];
    return Promise.resolve({
      index: item.__ref.id,
      canMove: true,
      data: treeItem,
      canRename: true,
      isFolder: !!children?.length,
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
        return i.__ref.id == itemId ? { ...i, children: newChildren } : i;
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
      if (i.__ref.id == item.index) {
        // request will have name in meta while other items will have name key at root
        return !!i.name
          ? { ...i, name }
          : { ...i, __meta: { ...i.__meta, name } };
      }
      return i;
    });
  }
}
