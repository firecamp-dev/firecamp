import { IRestResponse } from '@firecamp/types';
import { TStoreSlice } from '../store.type';

type TTestResult = {
  pass?: number;
  failed?: number;
  total?: number;
  tests?: { name: string; isPassed: boolean; error?: any }[];
};
type TScriptError = {
  type: string;
  error?: { name?: string; message?: string };
};
interface IResponseSlice {
  response: IRestResponse;
  testResult: TTestResult;
  scriptErrors?: TScriptError[];
  initialiseResponse: (response: IRestResponse) => void;
  setTestResult: (testResult: TTestResult) => void;
}

const emptyResponse: IRestResponse = {
  body: '',
  responseTime: 0,
  responseSize: 0,
  status: '',
  headers: [],
  timeline: '',
};

const createResponseSlice: TStoreSlice<IResponseSlice> = (set, get) => ({
  response: { code: 0 },
  testResult: {},
  scriptErrors: [],
  initialiseResponse: (response: IRestResponse) => {
    set((s) => ({
      response: {
        ...emptyResponse,
        ...response,
      },
    }));
  },
  setTestResult: (testResult) => {
    set((s) => ({
      testResult,
    }));
  },
});

export { IResponseSlice, createResponseSlice, emptyResponse };
