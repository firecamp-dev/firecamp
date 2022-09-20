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
      let { key, value } = updates;

      let updatedBody = {
        ...(get()?.request.body[bodyType] || []),
        [key]: value,
      };

      set((s) => {
        return {
          ...s,
          request: {
            ...s.request,
            body: {
              ...s.request.body,
              [bodyType]: updatedBody,
            },
          },
        };
      });

      // Prepare commit action for url
      get()?.prepareBodyPushAction(
        get()?.last?.request?.body[bodyType] || { value: '' },
        updatedBody,
        bodyType
      );
    },
  };
};

export { createBodySlice, IBodySlice };
