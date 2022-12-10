import { IRestBody, ERestBodyTypes, IHeader, EKeyValueTableRowType } from '@firecamp/types';
import { _array } from '@firecamp/utils';
import { nanoid } from 'nanoid';

interface IBodySlice {
  changeBodyValue: (bodyType: ERestBodyTypes, value: any) => void;
  updateHeadersOnBodyTypeChange: (type: ERestBodyTypes) => void;
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
    updateHeadersOnBodyTypeChange: (type: ERestBodyTypes) => {
        const state = get();
        const { headers } = state.request;
        let contentType = new String(type);
        let updatedHeaders: IHeader[] = [...headers];

        switch (type) {
          case ERestBodyTypes.GraphQL:
            contentType = ERestBodyTypes.Json;
            break;
          case ERestBodyTypes.Text:
          case ERestBodyTypes.Binary:
             contentType = `text/plain`;
            break;
          default:
             contentType = type;
            break;
        }

        // TODO: check without method for array object
        const headersWithoutContentType: IHeader[] = _array.without(
          headers,
          (h: IHeader) => h.key?.trim().toLowerCase() !== 'content-type'
        ) as unknown as IHeader[];

        if (type?.length) {
          const bodyHeader: IHeader = {
            id: nanoid(),
            key: 'Content-Type',
            value: contentType,
            type: EKeyValueTableRowType.Text,
            disable: false,
            description: '',
          };
          updatedHeaders = [...headersWithoutContentType, bodyHeader];
        } else if (contentType) {
          updatedHeaders = [...headersWithoutContentType];
        }
        state.changeHeaders(updatedHeaders);
    }
  };
};

export { createBodySlice, IBodySlice };
