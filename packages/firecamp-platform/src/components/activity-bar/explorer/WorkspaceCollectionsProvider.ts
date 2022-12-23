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
  __meta?: { type?: string; method?: string };
  __ref: {
    id: string;
    isCollection?: boolean;
    isFolder?: boolean;
    isRequest?: boolean;
    collectionId?: string; // exist in folder and request
    folderId?: string;
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
    this.init(collections, folders, requests, rootOrders);
  }

  public async getTreeItem(
    itemId: TreeItemIndex
  ): Promise<TreeItem<TTreeItemData>> {
    if (itemId == 'root') {
      return Promise.resolve({
        index: 'root',
        canMove: true,
        data: { name: 'Root', __ref: { id: 'root', isCollection: true } },
        canRename: false,
        isFolder: true,
        children: this.rootOrders,
      });
    }

    const item = this.items.find((i) => i.__ref?.id == itemId);
    if (!item) {
      console.log(itemId, 'item not found for itemId in children');
      // return { index: null, data: null };
      return Promise.resolve({ index: null, data: null });
    }

    const treeItem: TTreeItemData = {
      name: item.name || item.__meta.name, // in request, the `name` key will be in `__meta`
      __ref: {
        id: item.__ref.id,
        collectionId: item.__ref?.collectionId,
        folderId: item.__ref?.folderId,
      },
    };
    if (item.__ref?.isCollection == true) treeItem.__ref.isCollection = true;
    if (item.__ref?.isFolder == true) treeItem.__ref.isFolder = true;
    if (item.__ref?.isRequest == true) {
      treeItem.__ref.isRequest = true;
      treeItem.__meta = { type: item.__meta.type, method: item.method };
    }

    const children = _uniq([
      ...(item.__meta.fOrders || []),
      ...(item.__meta.rOrders || []),
    ]);
    return Promise.resolve({
      index: item.__ref.id,
      canMove: true,
      data: treeItem,
      canRename: true,
      isFolder: !treeItem.__ref.isRequest, //!!children?.length, //note: if it's false then folder click has no effect, we need to open it even it's empty
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
      // split new children into fOrders and rOrders
      const { fOrders, rOrders } = newChildren.reduce(
        (p, n) => {
          const item = this.items.find((i) => i.__ref.id == n);
          if (item && item.__ref.isFolder)
            return { fOrders: [...p.fOrders, n], rOrders: p.rOrders };
          else if (item && item.__ref.isRequest)
            return { fOrders: p.fOrders, rOrders: [...p.rOrders, n] };
          else return p;
        },
        { fOrders: [], rOrders: [] }
      );

      this.items = this.items.map((i) => {
        if (i.__ref.id == itemId) {
          if (i.__ref.isCollection)
            changeCollectionMetaOrders(itemId as string, {
              fOrders,
              rOrders,
            });
          if (i.__ref.isFolder)
            changeFolderMetaOrders(itemId as string, { fOrders, rOrders });
          return { ...i, __meta: { ...i.__meta, fOrders, rOrders } };
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
      if (i.__ref.id == item.index) {
        // request will have name in meta while other items will have name key at root
        return !!i.name
          ? { ...i, name }
          : { ...i, __meta: { ...i.__meta, name } };
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
        __ref: { ...i.__ref, isCollection: true },
      })),
      ...folders.map((i) => ({ ...i, __ref: { ...i.__ref, isFolder: true } })),
      ...requests.map((i) => ({
        ...i,
        __ref: { ...i.__ref, isRequest: true },
      })),
    ];
    this.rootOrders = rootOrders;
    setTimeout(() => {
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    });
  }

  public addCollectionItem(item: any) {
    this.items.push({ ...item, __ref: { ...item.__ref, isCollection: true } });
    this.rootOrders.push(item.__ref.id);
    this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
  }

  public updateCollectionItem(item: any) {
    this.items = this.items.map((i) => {
      if (item.__ref.id == i.__ref.id) {
        if (item.name) i.name = item.name;
        if (item.description) i.description = item.description;
      }
      return i;
    });
    this.emitter.emit(ETreeEventTypes.itemChanged, ['root', item.__ref.id]);
  }

  public deleteCollectionItem(itemId: string) {
    this.items = this.items.filter((i) => i.__ref.id != itemId);
    this.rootOrders = this.rootOrders.filter((i) => i != itemId);
    this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
  }

  public addFolderItem(item: any) {
    if (!item.__meta) item.__meta = { fOrders: [], rOrders: [] };
    this.items.push({ ...item, __ref: { ...item.__ref, isFolder: true } });
    const parentId = item.__ref.folderId || item.__ref.collectionId;
    this.items.map((i) => {
      if (i.__ref.id == parentId) {
        i.__meta.fOrders.push(item.__ref.id);
      }
      return i;
    });
    this.emitter.emit(ETreeEventTypes.itemChanged, [parentId]);
  }

  public updateFolderItem(item: any) {
    this.items = this.items.map((i) => {
      if (item.__ref.id == i.__ref.id) {
        if (item.name) i.name = item.name;
        if (item.description) i.description = item.description;
      }
      return i;
    });
    this.emitter.emit(ETreeEventTypes.itemChanged, [item.__ref.id]);
  }

  public deleteFolderItem(itemId: string) {
    const item = this.items.find((i) => i.__ref.id == itemId);
    if (!item) return;

    const parentId = item.__ref.folderId || item.__ref.collectionId;
    this.items = this.items
      .filter((i) => i.__ref.id != itemId)
      .map((i) => {
        // remove folder from parent's fOrders
        if (i.__ref.id == parentId) {
          const newFldOrders = i.__meta.fOrders.filter((f) => f != itemId);
          return { ...i, __meta: { ...i.__meta, fOrders: newFldOrders } };
        }
        return i;
      });

    this.emitter.emit(ETreeEventTypes.itemChanged, [parentId]);
  }

  public addRequestItem(item: any) {
    this.items.push({ ...item, __ref: { ...item.__ref, isRequest: true } });
    const parentId = item.__ref.folderId || item.__ref.collectionId;
    this.items.map((i) => {
      if (item.__ref.folderId && i.__ref.id == parentId) {
        i.__meta.rOrders.push(item.__ref.id);
      }
      return i;
    });
    this.emitter.emit(ETreeEventTypes.itemChanged, [parentId]);
  }

  public updateRequestItem(item: any) {
    this.items = this.items.map((i) => {
      if (item.__ref.id == i.__ref.id) {
        if (item.__meta?.name) i.__meta.name = item.__meta.name;
        if (item.__meta?.description)
          i.__meta.description = item.__meta.description;
      }
      return i;
    });
    const parentId = item.__ref.folderId || item.__ref.collectionId;
    this.emitter.emit(ETreeEventTypes.itemChanged, [parentId, item.__ref.id]);
  }

  public deleteRequestItem(itemId: string) {
    const item = this.items.find((i) => i.__ref.id == itemId);
    if (!item) return;
    this.items = this.items
      .filter((i) => i.__ref.id != itemId)
      .map((i) => {
        // remove request from parent's rOrders
        if (
          i.__ref.id == item.__ref.folderId ||
          i.__ref.id == item.__ref.collectionId
        ) {
          const newReqOrders = i.__meta.rOrders.filter((r) => r != itemId);
          return { ...i, __meta: { ...i.__meta, rOrders: newReqOrders } };
        }
        return i;
      });

    const parentId = item.__ref.folderId || item.__ref.collectionId;
    this.emitter.emit(ETreeEventTypes.itemChanged, [parentId]);
  }
}
