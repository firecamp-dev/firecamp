var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import EventEmitter from "eventemitter3";
const delay = async (ts) => {
  return new Promise((rs) => {
    setTimeout(() => {
      rs();
    }, ts);
  });
};
var ERunnerEvents = /* @__PURE__ */ ((ERunnerEvents2) => {
  ERunnerEvents2["Start"] = "start";
  ERunnerEvents2["BeforeRequest"] = "beforeRequest";
  ERunnerEvents2["Request"] = "request";
  ERunnerEvents2["BeforeFolder"] = "beforeFolder";
  ERunnerEvents2["Folder"] = "folder";
  ERunnerEvents2["BeforeIteration"] = "beforeIteration";
  ERunnerEvents2["Iteration"] = "iteration";
  ERunnerEvents2["Done"] = "done";
  return ERunnerEvents2;
})(ERunnerEvents || {});
class Runner {
  constructor(collection, options) {
    __publicField(this, "collection");
    __publicField(this, "options");
    __publicField(this, "folderRunSequence");
    __publicField(this, "testResults", []);
    __publicField(this, "emitter");
    __publicField(this, "result", {
      total: 0,
      pass: 0,
      fail: 0,
      skip: 0,
      duration: 0
    });
    this.collection = collection;
    this.options = options;
    this.folderRunSequence = /* @__PURE__ */ new Set();
    this.emitter = new EventEmitter();
    this.validate();
    this.assignDefaultOptions();
    this.prepareFolderRunSequence();
  }
  assignDefaultOptions() {
    if (!this.options.hasOwnProperty("iterationCount"))
      this.options.iterationCount = 1;
    if (!this.options.hasOwnProperty("delayRequest"))
      this.options.delayRequest = 0;
    if (!this.options.hasOwnProperty("timeout"))
      this.options.timeout = 0;
    if (!this.options.hasOwnProperty("timeoutRequest"))
      this.options.timeoutRequest = 0;
    if (typeof this.options.iterationCount != "number")
      throw new Error("--iteration-count is invalid", { cause: "invalidOption" });
    if (typeof this.options.delayRequest != "number")
      throw new Error("--delay-request is invalid", { cause: "invalidOption" });
    if (typeof this.options.timeout != "number")
      throw new Error("--timeout is invalid", { cause: "invalidOption" });
    if (typeof this.options.timeoutRequest != "number")
      throw new Error("--timeout-request is invalid", { cause: "invalidOption" });
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
    if (!__meta?.version)
      throw new Error("The collection format is invalid");
    if (_fs && !Array.isArray(_fs))
      throw new Error("The collection's folders format is invalid");
    if (_rs && !Array.isArray(_rs))
      throw new Error("The collection's requests format is invalid");
    if (_ris && !Array.isArray(_ris))
      throw new Error("The collection's request items format is invalid");
    return true;
  }
  prepareFolderRunSequence() {
    const { collection, folders } = this.collection;
    const folderMap = new Map(folders.map((folder) => [folder.__ref.id, folder]));
    const traverseFolders = (order) => order.flatMap(
      (folderId) => folderMap.has(folderId) ? [folderId, ...traverseFolders([folderMap.get(folderId).__ref.folderId])] : []
    );
    const ids = traverseFolders(collection.__meta.fOrders);
    ids.forEach(this.folderRunSequence.add, this.folderRunSequence);
  }
  updateResult(response = {}) {
    const { testResult: { total, passed, failed } = {
      total: 0,
      passed: 0,
      failed: 0
    } } = response;
    if (Number.isInteger(total))
      this.result.total += total;
    if (Number.isInteger(passed))
      this.result.pass += passed;
    if (Number.isInteger(failed))
      this.result.fail += failed;
  }
  async runRequest(requestId) {
    const { folders, requests } = this.collection;
    const request = requests.find((r) => r.__ref.id == requestId);
    this.emitter.emit("beforeRequest" /* BeforeRequest */, {
      name: request.__meta.name,
      url: request.url.raw,
      method: request.method.toUpperCase(),
      path: fetchRequestPath(folders, request),
      id: request.__ref.id
    });
    await delay(this.options.delayRequest);
    const response = await this.options.executeRequest(request);
    this.updateResult(response);
    this.emitter.emit("request" /* Request */, {
      id: request.__ref.id,
      response
    });
    return { request, response };
  }
  async runFolder(folderId) {
    const folder = this.collection.folders.find((f) => f.__ref.id == folderId);
    this.emitter.emit("beforeFolder" /* BeforeFolder */, {
      name: folder.name,
      id: folder.__ref.id
    });
    try {
      const requestIds = folder.__meta.rOrders || [];
      for (let i = 0; i < requestIds.length; i++) {
        const res = await this.runRequest(requestIds[i]);
        this.testResults.push(res);
      }
    } catch (e) {
      console.error(`Error while running the collection:`, e);
    }
    this.emitter.emit("folder" /* Folder */, {
      id: folder.__ref.id
    });
  }
  async runIteration() {
    try {
      const folderSet = this.folderRunSequence.values();
      const next = async () => {
        const { value: folderId, done } = folderSet.next();
        if (!done) {
          await this.runFolder(folderId);
          await next();
        }
      };
      await next();
    } catch (e) {
      console.error(`Error while running the collection:`, e);
    }
  }
  run() {
    setTimeout(async () => {
      const { collection } = this.collection;
      const startTs = (/* @__PURE__ */ new Date()).valueOf();
      this.emitter.emit("start" /* Start */, {
        name: collection.name,
        id: collection.__ref.id
      });
      for (let i = 0; i < this.options.iterationCount; i++) {
        this.emitter.emit("beforeIteration" /* BeforeIteration */, {
          current: i + 1,
          total: this.options.iterationCount
        });
        await this.runIteration();
        this.emitter.emit("iteration" /* Iteration */, {
          current: i + 1,
          total: this.options.iterationCount
        });
      }
      this.result.duration = (/* @__PURE__ */ new Date()).valueOf() - startTs;
      this.emitter.emit("done" /* Done */, {
        result: {
          ...this.result
        }
      });
    });
    return this.exposeOnlyOn();
  }
  exposeOnlyOn() {
    return {
      on: (evt, fn) => {
        this.emitter.on(evt, fn);
        return this.exposeOnlyOn();
      }
    };
  }
}
const fetchRequestPath = (folders, request) => {
  const requestPath = [];
  const requestFolderId = request.__ref.folderId;
  let currentFolder = folders.find((folder) => folder.__ref.id === requestFolderId);
  while (currentFolder) {
    requestPath.unshift(currentFolder.name);
    const parentFolderId = currentFolder.__ref.folderId;
    currentFolder = folders.find((folder) => folder.__ref.id === parentFolderId);
  }
  return `./${requestPath.join("/")}`;
};
export {
  ERunnerEvents,
  Runner as default
};
