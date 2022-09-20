// @ts-nocheck
export default class URLWorker {
  constructor(ctx, createData) {
    this._ctx = ctx;
    debugger;
  }
}

// @ts-ignore
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';

self.onmessage = () => {
  debugger;
  try {
    worker.initialize((ctx, createData) => {
      // debugger
      console.log(ctx, createData);
      return new URLWorker(ctx, createData);
      // return new GraphQLWorker(ctx, createData);
    });
  } catch (err) {
    debugger;
    throw err;
  }
};
