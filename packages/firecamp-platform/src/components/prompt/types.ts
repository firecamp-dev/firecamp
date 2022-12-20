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

export interface IPromptSaveItem extends Omit<IPromptInput, 'executor'> {
  folders: any[];
  executor?: (obj: { value: string; folderId: string }) => Promise<any>;
}
