import { encrypt, decrypt, PrivateKey, PublicKey } from 'eciesjs';
import { fcEncryptedIdb } from '../idb/idb';

class Ecies {
  private db: typeof fcEncryptedIdb;
  constructor() {
    this.db = fcEncryptedIdb;
    this.init();
  }
  private async init() {
    let [s, pbk] = await this.db.getMany(['s', 'pbk']);
    if (!s || !pbk) {
      const sk = new PrivateKey();
      this.db.setMany([
        ['s', sk.secret],
        ['pbk', sk.publicKey],
      ]);
    }
  }

  private async encrypt(data: string) {
    const _pb = await this.db.get('pbk');
    const pb = new PublicKey(_pb.data);
    return encrypt(pb.toHex(), Buffer.from(data));
  }

  private async decrypt(data: Uint8Array) {
    const _s = await this.db.get('s');
    return decrypt(_s, data).toString();
  }

  public async setTokens(at: string, rt: string) {
    const _at = await this.encrypt(at);
    const _rt = await this.encrypt(rt);
    this.db.setMany([
      ['at', _at],
      ['rt', _rt],
    ]);
  }

  public async getAccessToken() {
    const at = await this.db.get('at');
    return this.decrypt(at);
  }

  public async getRefreshToken() {
    const rt = await this.db.get('rt');
    return this.decrypt(rt);
  }

  public clear() {
    this.db.clear();
  }
}

const ecies = new Ecies();
export { ecies };
