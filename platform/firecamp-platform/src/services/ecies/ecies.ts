import { encrypt, decrypt, PrivateKey, PublicKey } from 'eciesjs';
import { fcEncryptedIdb } from '../idb/idb';

class Ecies {
  private db: typeof fcEncryptedIdb;
  constructor() {
    this.db = fcEncryptedIdb;
    this.init();
  }
  private async init(): Promise<{ secret: any; publicKey: any }> {
    let [s, pbk] = await this.db.getMany(['s', 'pbk']);
    if (s && pbk) return { secret: s, publicKey: pbk };

    const sk = new PrivateKey();
    await this.db.setMany([
      ['s', sk.secret],
      ['pbk', sk.publicKey],
    ]);
    return { secret: sk.secret, publicKey: sk.publicKey };
  }

  private async encrypt(data: string) {
    const { publicKey } = await this.init();
    const pb = new PublicKey(publicKey.data);
    return encrypt(pb.toHex(), Buffer.from(data));
  }

  private async decrypt(data: Uint8Array) {
    const _s = await this.db.get('s').catch(console.log);
    if (!_s) return Promise.reject('secret not found');
    return decrypt(_s, data).toString();
  }

  public async setTokens(at: string, rt: string) {
    const _at = await this.encrypt(at);
    const _rt = await this.encrypt(rt);
    if (!_at) return Promise.reject('error in access token encryptio');
    if (!_rt) return Promise.reject('error in refresh token encryptio');
    return this.db.setMany([
      ['at', _at],
      ['rt', _rt],
    ]);
  }

  public async getAccessToken() {
    const at = await this.db.get('at');
    if (!at) return Promise.reject('access token not found');
    return this.decrypt(at);
  }

  public async getRefreshToken() {
    const rt = await this.db.get('rt');
    if (!rt) return Promise.reject('refresh token not found');
    return this.decrypt(rt);
  }

  public clear() {
    this.db.clear();
  }
}

const ecies = new Ecies();
export { ecies };
