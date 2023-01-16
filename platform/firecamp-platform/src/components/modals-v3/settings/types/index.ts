import { IRestScripts } from '@firecamp/types';

export interface ICollectionSettingUi {
  name: string;
  description: string;
  scripts: IRestScripts;
  auth: any, //IUiAuth;
  __meta: { [key: string]: any };
  __ref: { [key: string]: any };
}

export interface IFolderSettingUi extends ICollectionSettingUi {}
