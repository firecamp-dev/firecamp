import { IRestResponse } from '@firecamp/types';

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

const createResponseSlice = (set, get): IResponseSlice => ({
  response: { statusCode: 0 },

  initialiseResponse: (response: IRestResponse) => {
    set((s) => ({
      ...s,
      response: {
        ...emptyResponse,
        ...response,
      },
    }));
  },
});

export { IResponseSlice, createResponseSlice, emptyResponse };
