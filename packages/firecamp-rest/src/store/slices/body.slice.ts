import {
  IRestBody,
  ERestBodyTypes,
  IHeader,
  EKeyValueTableRowType,
} from '@firecamp/types';
import { _array } from '@firecamp/utils';
import { nanoid } from 'nanoid';
import { TStoreSlice } from '../store.type';

interface IBodySlice {
  changeBodyValue: (value: any) => void;
  changeBodyType: (bodyType: ERestBodyTypes) => void;
  updateHeadersOnBodyTypeChange: (type: ERestBodyTypes) => void;
}
const createBodySlice: TStoreSlice<IBodySlice> = (
  set,
  get,
  initialBody: IRestBody
) => {
  return {
    // change the value of active body, example, write the json or multipart table
    changeBodyValue: (value: any) => {
      const state = get();
      const {
        body: { type },
      } = state.request;
      const reqBody = { type, value };
      set((s) => {
        return {
          request: {
            ...s.request,
            body: reqBody,
          },
          runtime: {
            ...s.runtime,
            bodies: {
              ...s.runtime.bodies,
              [type]: value,
            },
          },
        };
      });
      state.equalityChecker({ body: reqBody });
    },
    changeBodyType: (type: ERestBodyTypes) => {
      const state = get();
      set((s) => {
        const body = { value: s.runtime.bodies[type], type };
        return {
          request: {
            ...s.request,
            body,
          },
          ui: {
            ...s.ui,
            requestPanel: {
              ...s.ui.requestPanel,
              hasBody: type != 'none',
            },
          },
        };
      });
      // @note: only update headers after body type changed
      state.updateHeadersOnBodyTypeChange(type);
    },
    updateHeadersOnBodyTypeChange: (type: ERestBodyTypes) => {
      const state = get();
      const { headers } = state.request;
      let contentType = '' + type;
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

      const headersWithoutContentType: IHeader[] = updatedHeaders.filter(
        (h: IHeader) => h.key?.trim().toLowerCase() !== 'content-type'
      );

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
    },
  };
};

export { createBodySlice, IBodySlice };
