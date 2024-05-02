import {
  get,
  getMany,
  set,
  setMany,
  update,
  del,
  delMany,
  clear,
  createStore,
} from 'idb-keyval';

class Idb {
  private db: any;
  private dbName: string;
  private storeName: string;
  constructor(db: string, store: string = 'kv') {
    this.dbName = db;
    this.storeName = store;
    this.db = createStore(this.dbName, this.storeName);
  }
  public get: typeof get = (key) => get(key, this.db);
  public getMany: typeof getMany = (keys) => getMany(keys, this.db);
  public set: typeof set = (key, value) => set(key, value, this.db);
  public setMany: typeof setMany = (key) => setMany(key, this.db);
  public update: typeof update = (key, cb) => update(key, cb, this.db);
  public del: typeof del = (key) => del(key, this.db);
  public delMany: typeof delMany = (keys) => del(keys, this.db);
  public clear: typeof clear = () => clear(this.db);
}

const fcEncryptedIdb = new Idb('fce-kv-db');
export { fcEncryptedIdb };
