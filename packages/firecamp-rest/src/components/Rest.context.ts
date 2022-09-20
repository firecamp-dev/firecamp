import { EAuthTypes } from '@firecamp/types';
import { createContext } from 'react';

export const RestContext = createContext<IRestContext>({});

export interface IRestContext {
  ctx_resetAuthHeaders?: (authType: EAuthTypes) => void;
  ctx_updateAuthValue?: (
    authType: EAuthTypes,
    updates: { key: string; value: any } | any
  ) => void;
  ctx_updateActiveAuth?: (authType: EAuthTypes) => void;
}
