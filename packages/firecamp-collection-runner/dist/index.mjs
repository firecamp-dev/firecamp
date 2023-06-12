var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import RestExecutor from "@firecamp/rest-executor";
class Runner {
  constructor(collection, options) {
    __publicField(this, "collection");
    __publicField(this, "options");
    __publicField(this, "requestOrdersForExecution");
    __publicField(this, "executedRequestQueue");
    __publicField(this, "currentRequestInExecution");
    __publicField(this, "testResults", []);
    this.collection = collection;
    this.options = options;
    this.requestOrdersForExecution = /* @__PURE__ */ new Set();
    this.executedRequestQueue = /* @__PURE__ */ new Set();
    this.currentRequestInExecution = "";
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
      if (folder.__meta.fOrders?.length) {
        const rIds = folder.__meta.fOrders.map((fId2) => extractRequestIdsFromFolder(fId2, requestIds));
        requestIds = [...requestIds, ...rIds];
      }
      if (folder.__meta.rOrders?.length) {
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
    const executor = new RestExecutor();
    const request = requests.find((r) => r.__ref.id == requestId);
    const res = await executor.send(request, { collectionVariables: [], environment: [], globals: [] });
    return res;
  }
  async executeRequestRecursively() {
    const { value: requestId, done } = this.requestOrdersForExecution.values().next();
    this.currentRequestInExecution = requestId;
    const res = await this.executeRequest(requestId);
    const { testResult } = res;
    this.testResults.push(testResult);
    this.executedRequestQueue.add(requestId);
    this.requestOrdersForExecution.delete(requestId);
    if (!done)
      await this.executeRequestRecursively();
  }
  async run() {
    console.log("I am into the Runner...");
    try {
      this.validate();
    } catch (e) {
      throw e;
    }
    this.prepareRequestExecutionOrder();
    await this.executeRequestRecursively();
    return this.testResults;
  }
}
export {
  Runner as default
};
