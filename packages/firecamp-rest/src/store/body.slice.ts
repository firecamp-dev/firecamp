import { IRestBody, ERestBodyTypes } from '@firecamp/types';

interface IBodySlice {
  changeBodyValue: (bodyType: ERestBodyTypes, value: any) => void;
}
const createBodySlice = (set, get, initialBody: IRestBody): IBodySlice => {
  return {
    // change the value of active body, example, write the json or multipart table
    changeBodyValue: (
      bodyType: ERestBodyTypes,
      updates: { key: string; value: any }
    ) => {
      const state = get();
      const { key, value } = updates;
      const updatedBodyType = {
        ...state.request.body[bodyType],
        [key]: value,
      };
      const updatedBody = {
        ...state.request.body,
        [bodyType]: updatedBodyType,
      };
      set((s) => {
        return {
          ...s,
          request: {
            ...s.request,
            body: updatedBody,
          },
        };
      });
      state.equalityChecker({ body: updatedBody });
    },
  };
};

export { createBodySlice, IBodySlice };
