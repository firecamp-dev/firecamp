import { IRestResponse } from '@firecamp/types';
import { TStoreSlice } from '../store.type';

interface IResponseSlice {
  response: IRestResponse;
  initialiseResponse: (response: IRestResponse) => void;
}

const emptyResponse = {
  data: '',
  duration: 0,
  size: 0,
  status: 0,
  headers: {},
  timeline: '',
};

const createResponseSlice: TStoreSlice<IResponseSlice> = (set, get) => ({
  response: { statusCode: 0 },
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
