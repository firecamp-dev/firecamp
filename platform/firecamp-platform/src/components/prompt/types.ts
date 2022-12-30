import { TId } from '@firecamp/types';

export interface IPromptInput {
  header: string;
  lable?: string;
  placeholder?: string;
  texts?: {
    btnOk?: string;
    btnOking?: string;
    btnCancle?: string;
  };
  value: string;
  onClose: Function;
  validator?: (value: string) => { isValid: boolean; message?: string };
  executor?: (value: string) => Promise<any>;
  onResolve: (res: any) => void;
  onError?: (e) => void;
}

export interface IPromptSaveItem
  extends Omit<IPromptInput, 'validator' | 'executor'> {
  collection: {
    items: any[];
    rootOrders: TId[];
  };
  validator?: (obj: { value: string; itemId: TId }) => {
    isValid: boolean;
    message?: string;
  };
  executor?: (obj: { value: string; itemId: TId }) => Promise<any>;
}
