import { IRestScripts, IUiAuth } from '@firecamp/types';

export interface ICollectionSettingUi {
  name: string;
  description: string;
  scripts: IRestScripts;
  auth: IUiAuth;
  meta: { [key: string]: any };
  _meta: { [key: string]: any };
}

export interface IFolderSettingUi extends ICollectionSettingUi {}
