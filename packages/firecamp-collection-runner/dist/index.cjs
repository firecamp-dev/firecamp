"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var _eventemitter3 = require('eventemitter3'); var _eventemitter32 = _interopRequireDefault(_eventemitter3);
var ERunnerEvents = /* @__PURE__ */ ((ERunnerEvents2) => {
  ERunnerEvents2["Start"] = "start";
  ERunnerEvents2["BeforeRequest"] = "beforeRequest";
  ERunnerEvents2["Request"] = "request";
  ERunnerEvents2["Done"] = "done";
  return ERunnerEvents2;
})(ERunnerEvents || {});
class Runner {
  constructor(collection, options) {
    __publicField(this, "collection");
    __publicField(this, "options");
    __publicField(this, "requestOrdersForExecution");
    __publicField(this, "executedRequestQueue");
    __publicField(this, "currentRequestInExecution");
    __publicField(this, "testResults", []);
    __publicField(this, "emitter");
    this.collection = collection;
    this.options = options;
    this.requestOrdersForExecution = /* @__PURE__ */ new Set();
    this.executedRequestQueue = /* @__PURE__ */ new Set();
    this.currentRequestInExecution = "";
    this.emitter = new (0, _eventemitter32.default)();
  }
  /**
   * validate that the collection format is valid
   * TODO: late we need to add the zod or json schema here for strong validation
   * 
   * @param collection "collection json payload"
   * @returns boolean
   */
  validate() {
    const { collection: _c, folders: _fs, requests: _rs, requestItems: _ris, __meta } = this.collection;
    if (!_optionalChain([__meta, 'optionalAccess', _ => _.version]))
      throw new Error("The collection format is invalid");
    if (_fs && !Array.isArray(_fs))
      throw new Error("The collection's folders format is invalid");
    if (_rs && !Array.isArray(_rs))
      throw new Error("The collection's requests format is invalid");
    if (_ris && !Array.isArray(_ris))
      throw new Error("The collection's request items format is invalid");
    return true;
  }
  /**
   * prepare an Set of request execution order
   */
  prepareRequestExecutionOrder() {
    const { collection, folders } = this.collection;
    const { __meta: { fOrders: rootFolderIds = [], rOrders: rootRequestIds = [] } } = collection;
    const extractRequestIdsFromFolder = (fId, requestIds = []) => {
      const folder = folders.find((f) => f.__ref.id == fId);
      if (!folder)
        return requestIds;
      if (_optionalChain([folder, 'access', _2 => _2.__meta, 'access', _3 => _3.fOrders, 'optionalAccess', _4 => _4.length])) {
        const rIds = folder.__meta.fOrders.map((fId2) => extractRequestIdsFromFolder(fId2, requestIds));
        requestIds = [...requestIds, ...rIds];
      }
      if (_optionalChain([folder, 'access', _5 => _5.__meta, 'access', _6 => _6.rOrders, 'optionalAccess', _7 => _7.length])) {
        requestIds = [...requestIds, ...folder.__meta.rOrders];
      }
      return requestIds;
    };
    if (Array.isArray(rootFolderIds)) {
      rootFolderIds.map((fId) => {
        const requestIds = extractRequestIdsFromFolder(fId);
        requestIds.forEach(this.requestOrdersForExecution.add, this.requestOrdersForExecution);
      });
    }
    if (Array.isArray(rootRequestIds)) {
      rootRequestIds.forEach(this.requestOrdersForExecution.add, this.requestOrdersForExecution);
    }
  }
  async executeRequest(requestId) {
    const { requests } = this.collection;
    const request = requests.find((r) => r.__ref.id == requestId);
    const response = await this.options.executeRequest(request);
    return { request, response };
  }
  async startExecution() {
    try {
      const { value: requestId, done } = this.requestOrdersForExecution.values().next();
      if (!done) {
        this.currentRequestInExecution = requestId;
        const res = await this.executeRequest(requestId);
        this.testResults.push(res);
        this.executedRequestQueue.add(requestId);
        this.requestOrdersForExecution.delete(requestId);
        await this.startExecution();
      }
    } catch (error) {
      console.error(`Error while running the collection:`, error);
    }
  }
  _emit(evt) {
    const { collection } = this.collection;
    switch (evt) {
      case "start" /* Start */:
        this.emitter.emit(evt, {
          name: collection.name,
          id: collection.__ref.id
        });
        break;
      case "beforeRequest" /* BeforeRequest */:
        this.emitter.emit(evt);
        break;
      case "request" /* Request */:
        this.emitter.emit(evt);
        break;
      case "done" /* Done */:
        this.emitter.emit(evt, 558899);
        break;
    }
  }
  on() {
    return {
      on: (evt, fn) => {
        this.emitter.on(evt, fn);
        return this.on();
      }
    };
  }
  run() {
    try {
      this.validate();
    } catch (e) {
      throw e;
    }
    this.prepareRequestExecutionOrder();
    setTimeout(async () => {
      this._emit("start" /* Start */);
      await this.startExecution();
      this._emit("done" /* Done */);
    });
    return this.on();
  }
}



exports.ERunnerEvents = ERunnerEvents; exports.default = Runner;
