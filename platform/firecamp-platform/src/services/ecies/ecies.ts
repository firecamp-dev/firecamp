import { encrypt, decrypt, PrivateKey, PublicKey } from 'eciesjs';
import CloudApiGlobal, { Rest } from '@firecamp/cloud-apis';
import { fcEncryptedIdb } from '../idb/idb';
import { ECloudApiHeaders } from '../../types';

class Ecies {
  private db: typeof fcEncryptedIdb;
  constructor() {
    this.db = fcEncryptedIdb;
    this.init();

    setInterval(() => {
      this.rotateTokens();
    }, 5 * 60 * 1000); // check for token rotation on every 5min
  }
  private async init(): Promise<{ secret: any; publicKey: any; ts: number }> {
    let [s, pbk, ts] = await this.db.getMany(['s', 'pbk', 'ts']);
    if (s && pbk && ts) return { secret: s, publicKey: pbk, ts };

    const sk = new PrivateKey();
    const _ts = new Date().valueOf();
    await this.db.setMany([
      ['s', sk.secret],
      ['pbk', sk.publicKey],
      ['ts', _ts],
    ]);
    return { secret: sk.secret, publicKey: sk.publicKey, ts: _ts };
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

  // silently rotate access and refresh tokens if the last timestamp is 30min old
  public async rotateTokens() {
    let ts = await this.db.get('ts');
    if (!ts) ts = 0;
    const cts = new Date().valueOf();
    // if the ts diff is less than 30min then don't rotate token
    if (Math.abs(cts - ts) < 30 * 60 * 1000) return false;

    try {
      const at = await this.getAccessToken();
      const rt = await this.getRefreshToken();
      if (!at || !rt) return false;
      const { data } = await Rest.auth.rotateTokens(at, rt);
      if (!data?.data) return false;
      const { accessToken, refreshToken } = data.data;
      await this.setTokens(accessToken, refreshToken);
      CloudApiGlobal.setGlobalHeader(
        ECloudApiHeaders.Authorization,
        `bearer ${accessToken}`
      );
      return true;
    } catch (e) {
      // console.log('error while rotating tokens', e);
      return false;
    }
  }

  public async setTokens(at: string, rt: string) {
    const _at = await this.encrypt(at);
    const _rt = await this.encrypt(rt);
    if (!_at) return Promise.reject('error in access token encryptio');
    if (!_rt) return Promise.reject('error in refresh token encryptio');
    return this.db.setMany([
      ['at', _at],
      ['rt', _rt],
      ['ts', new Date().valueOf()],
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
