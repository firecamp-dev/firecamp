import mitt from 'mitt';
import { Disposable, TreeItem, TreeItemIndex } from '@firecamp/ui-kit/src/tree';
import { IEnvironment, EEnvironmentScope } from '@firecamp/types';

enum ETreeEventTypes {
  itemChanged = 'itemChanged',
}

export class WrsEnvDataProvider {
  private items: Record<TreeItemIndex, TreeItem>; //ExplicitDataSource;
  private workspace: any;
  private emitter = mitt();
  constructor(workspace) {
    this.workspace = workspace;
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

  public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {
    //@ts-ignore
    this.items = {
      ...this.items,
      [item._meta.id]: { ...this.items[item._meta.id], name },
    };
    this.emitter.emit(ETreeEventTypes.itemChanged, [item.index]);

    // if (this.setItemName) {
    //   this.items[item.index] = this.setItemName(item, name);
    //   // this.onDidChangeTreeDataEmitter.emit(item.index);
    // }
  }

  // extra methods of provider
  init(envs: IEnvironment[] = []) {
    envs = envs.filter((e) => e.meta.type == EEnvironmentScope.Workspace);
    const children: string[] = envs.map((e) => e._meta.id);
    this.items = {
      root: {
        index: 'root',
        hasChildren: true,
        children: [this.workspace._meta.id],
        data: { name: 'root', _meta: { id: 'root' } },
      },
      [this.workspace._meta.id]: {
        index: this.workspace._meta.id,
        hasChildren: true,
        children,
        data: {
          name: this.workspace.name,
          _meta: { ...this.workspace._meta, is_workspace: true },
        },
      },
    };

    envs.map((env, i) => {
      this.items[env._meta.id] = {
        index: env._meta.id,
        children: [],
        hasChildren: false,
        data: {
          ...env,
          _meta: { ...env._meta, is_environment: true },
        },
      };
    });
    setTimeout(() => {
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    });
  }

  public addEnvItem(env: any) {
    const wrsId = env._meta.workspace_id;
    const envId = env._meta.id;
    this.items = {
      ...this.items,
      [wrsId]: {
        ...this.items[wrsId],
        children: [...this.items[wrsId].children, envId],
      },
      [envId]: {
        index: envId,
        children: [],
        hasChildren: false,
        data: { ...env, _meta: { ...env._meta, is_environment: true } },
      },
    };
    this.emitter.emit(ETreeEventTypes.itemChanged, [wrsId]);
  }

  public removeEnvItem(envId: string) {
    const env = this.items[envId].data;
    const wrsId = env._meta.workspace_id;
    delete this.items[envId];
    this.items = {
      ...this.items,
      [wrsId]: {
        ...this.items[wrsId],
        children: this.items[wrsId].children.filter((c) => c != envId),
      },
    };
    this.emitter.emit(ETreeEventTypes.itemChanged, [wrsId]);
  }
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

  public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {
    //@ts-ignore
    this.items = {
      ...this.items,
      [item._meta.id]: { ...this.items[item._meta.id], name },
    };
    this.emitter.emit(ETreeEventTypes.itemChanged, [item.index]);

    // if (this.setItemName) {
    //   this.items[item.index] = this.setItemName(item, name);
    //   // this.onDidChangeTreeDataEmitter.emit(item.index);
    // }
  }

  // extra methods of provider
  init(envs: IEnvironment[] = []) {
    const children: string[] = this.collections.map((c) => c._meta.id);
    this.items = {
      root: {
        index: 'root',
        hasChildren: true,
        children,
        data: { name: 'root' },
      },
    };

    this.collections.map((c) => {
      this.items[c._meta.id] = {
        index: c._meta.id,
        children: envs
          .filter((e) => e._meta?.collection_id == c._meta.id)
          .map((e) => e._meta.id),
        hasChildren: true,
        data: {
          name: c.name,
          _meta: { ...c._meta, is_collection: true },
        },
      };
    });

    envs.map((env, i) => {
      this.items[env._meta.id] = {
        index: env._meta.id,
        children: [],
        hasChildren: false,
        data: {
          ...env,
          _meta: { ...env._meta, is_environment: true },
        },
      };
    });
    setTimeout(() => {
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    });
  }

  public addEnvItem(env: any) {
    const colId = env._meta.collection_id;
    const envId = env._meta.id;
    this.items = {
      ...this.items,
      [colId]: {
        ...this.items[colId],
        children: [...this.items[colId].children, envId],
      },
      [envId]: {
        index: envId,
        children: [],
        hasChildren: false,
        data: { ...env, _meta: { ...env._meta, is_environment: true } },
      },
    };
    this.emitter.emit(ETreeEventTypes.itemChanged, [colId]);
  }

  public removeEnvItem(envId: string) {
    const env = this.items[envId].data;
    const colId = env._meta.collection_id;
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
