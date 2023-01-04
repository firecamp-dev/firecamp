// @ts-nocheck
import { FC } from 'react';
import { Column } from '@firecamp/ui-kit';
import Setting from './setting/Setting';
import Scripts from './scripts/Scripts';
import Auth from './auth/Auth';

import { EFolderSettingTabs } from '../../../../constants';

const SettingBody: FC<ISettingBody> = ({
  module = {},
  folderId = '',
  selectedBody = '',
  updateModule = () => {},
}) => {
  let _renderBody = () => {
    switch (selectedBody) {
      case EFolderSettingTabs.SETTING:
        return (
          <Setting
            name={module.name || ''}
            description={module.description || ''}
            updateModule={updateModule}
          />
        );
        break;

      case EFolderSettingTabs.AUTH:
        return <Auth module={module} folderId={folderId} />;

        break;
      case EFolderSettingTabs.SCRIPT:
        return <Scripts module={module} folderId={folderId} />;
        break;
    }
  };

  return <Column className="h-full">{_renderBody()}</Column>;
};

export default SettingBody;

interface ISettingBody {
  module: object;
  folderId: string;
  selectedBody: string;
  updateModule: Function;
}
