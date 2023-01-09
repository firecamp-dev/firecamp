import mitt from 'mitt';
import { Disposable, TreeItem, TreeItemIndex } from '@firecamp/ui-kit/src/tree';
import { IEnvironment, EEnvironmentScope } from '@firecamp/types';

enum ETreeEventTypes {
  itemChanged = 'itemChanged',
}
export class CollectionEnvDataProvider {
  private items: Record<TreeItemIndex, TreeItem>; //ExplicitDataSource;
  private collections: any[];
  private emitter = mitt();
  constructor(collections) {
    this.collections = collections;
    this.init([]);
  }

  public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem<any>> {
    return this.items[itemId];
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ): Promise<void> {
    this.items = {
      ...this.items,
      [itemId]: { ...this.items[itemId], children: newChildren },
    };
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

  public async onRenameItem(
    item: TreeItem<IEnvironment>,
    name: string
  ): Promise<void> {
    this.items = {
      ...this.items,
      [item.data.__ref.id]: {
        ...this.items[item.data.__ref.id],
        data: { ...item.data, name },
      },
    };
    this.emitter.emit(ETreeEventTypes.itemChanged, [item.index]);

    // if (this.setItemName) {
    //   this.items[item.index] = this.setItemName(item, name);
    //   // this.onDidChangeTreeDataEmitter.emit(item.index);
    // }
  }

  // extra methods of provider
  init(envs: IEnvironment[] = []) {
    const children: string[] = this.collections.map((c) => c.__ref.id);
    this.items = {
      root: {
        index: 'root',
        isFolder: true,
        children,
        data: { name: 'root' },
      },
    };

    this.collections.map((c) => {
      this.items[c.__ref.id] = {
        index: c.__ref.id,
        children: envs
          .filter((e) => e.__ref?.collectionId == c.__ref.id)
          .map((e) => e.__ref.id),
        isFolder: true,
        data: {
          name: c.name,
          __ref: { ...c.__ref, isCollection: true },
        },
      };
    });

    envs.map((env, i) => {
      this.items[env.__ref.id] = {
        index: env.__ref.id,
        children: [],
        isFolder: false,
        data: {
          ...env,
          __ref: { ...env.__ref, isEnvironment: true },
        },
      };
    });
    setTimeout(() => {
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    });
  }

  public addEnvItem(env: any) {
    const colId = env.__ref.collectionId;
    const envId = env.__ref.id;
    this.items = {
      ...this.items,
      [colId]: {
        ...this.items[colId],
        children: [...this.items[colId].children, envId],
      },
      [envId]: {
        index: envId,
        children: [],
        isFolder: false,
        data: { ...env, __ref: { ...env.__ref, isEnvironment: true } },
      },
    };
    this.emitter.emit(ETreeEventTypes.itemChanged, [colId]);
  }

  public removeEnvItem(envId: string) {
    const env = this.items[envId].data;
    const colId = env.__ref.collectionId;
    delete this.items[envId];
    this.items = {
      ...this.items,
      [colId]: {
        ...this.items[colId],
        children: this.items[colId].children.filter((c) => c != envId),
      },
    };
    this.emitter.emit(ETreeEventTypes.itemChanged, [colId]);
  }
}
