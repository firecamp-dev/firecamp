var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Runner {
  constructor(collection, options) {
    __publicField(this, "collection");
    __publicField(this, "options");
    this.collection = collection;
    this.options = options;
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
  async run() {
    console.log("I am into the Runner...");
    try {
      this.validate();
    } catch (e) {
      throw e;
    }
    const requestOrdersForExecution = /* @__PURE__ */ new Set();
    const executedRequestQueue = /* @__PURE__ */ new Set();
    const currentRequestInExecution = "";
    const { __meta: { fOrders: rootFolderIds = [], rOrders: rootRequestIds = [] } } = this.collection;
    if (Array.isArray(rootFolderIds)) {
      rootFolderIds.forEach((folderId) => {
      });
    }
  }
}
export {
  Runner as default
};
