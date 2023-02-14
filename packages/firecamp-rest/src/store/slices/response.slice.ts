import { IRestResponse } from '@firecamp/types';
import { TStoreSlice } from '../store.type';

interface IResponseSlice {
  response: IRestResponse;
  initialiseResponse: (response: IRestResponse) => void;
}

const emptyResponse = {
  body: '',
  responseTime: 0,
  responseSize: 0,
  status: '',
  headers: [],
  timeline: '',
};

const createResponseSlice: TStoreSlice<IResponseSlice> = (set, get) => ({
  response: { code: 0 },
  initialiseResponse: (response: IRestResponse) => {
    set((s) => ({
      response: {
        ...emptyResponse,
        ...response,
      },
    }));
  },
});

export { IResponseSlice, createResponseSlice, emptyResponse };
