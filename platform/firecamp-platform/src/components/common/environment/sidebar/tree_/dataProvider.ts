import mitt from 'mitt';
import { Disposable, TreeItem, TreeItemIndex } from '@firecamp/ui/src/tree';
import { IEnv, TId } from '@firecamp/types';

enum ETreeEventTypes {
  itemChanged = 'itemChanged',
}
export class EnvironmentDataProvider {
  private items: Record<TreeItemIndex, TreeItem>; //ExplicitDataSource;
  private rootChildren: string[];
  private emitter = mitt();
  constructor(environments = []) {
    this.rootChildren = [];
    this.init(environments);
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
    item: TreeItem<Partial<IEnv>>,
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
  init(envs: Partial<IEnv[]> = []) {
    this.rootChildren = envs.map((c) => c.__ref.id);
    this.items = {
      root: {
        index: 'root',
        isFolder: true,
        children: this.rootChildren,
        data: { name: 'root' },
      },
    };

    envs.map((env, i) => {
      this.items[env.__ref.id] = {
        index: env.__ref.id,
        children: [],
        isFolder: false,
        data: { ...env },
      };
    });
    setTimeout(() => {
      this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
    });
  }

  public addEnvItem(env: Partial<IEnv>) {
    const envId = env.__ref.id;
    this.items = {
      ...this.items,
      [envId]: {
        index: envId,
        children: [],
        isFolder: false,
        data: { ...env },
      },
    };
    this.rootChildren = [...this.rootChildren, envId];
    this.items['root'].children = this.rootChildren;
    this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
  }

  public updateEnvItem(env: Partial<IEnv>) {
    const envId = env.__ref.id;
    const {
      variables: [], // ignore variables if present, we don't need it in the tree
      ..._env
    } = env;
    this.items = {
      ...this.items,
      [envId]: {
        index: envId,
        children: [],
        isFolder: false,
        data: { ..._env },
      },
    };
    this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
  }

  public removeEnvItem(envId: TId) {
    this.rootChildren = this.rootChildren.filter((id) => id != envId);
    this.items['root'].children = this.rootChildren;
    delete this.items[envId];
    this.items = { ...this.items };
    this.emitter.emit(ETreeEventTypes.itemChanged, ['root']);
  }
}
