import mitt from 'mitt';
export default class Emitter {
  constructor(e) {
    Object.assign(this, mitt(e));
  }
}
