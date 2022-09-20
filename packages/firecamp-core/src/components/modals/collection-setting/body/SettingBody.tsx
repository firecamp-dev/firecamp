// @ts-nocheck
import { FC } from 'react';
import { Column } from '@firecamp/ui-kit';

import Setting from './setting/Setting';
// import Environment from './environment/Environment';
import Scripts from './scripts/Scripts';
import Statistics from './Statistics';
import Auth from './auth/Auth';

import { ECollectionSettingTabs } from '../../../../constants';

const SettingBody: FC<ISettingBody> = ({
  project = {},
  collectionId = '',
  selectedBody = '',
  updateProject = () => {},
}) => {
  let _renderBody = () => {
    switch (selectedBody) {
      case ECollectionSettingTabs.SETTING:
        return (
          <Setting
            name={project.name || ''}
            description={project.description || ''}
            updateProject={updateProject}
          />
        );
        break;

      case ECollectionSettingTabs.ENVIRONMENT:
        return <></>;
        // return <Environment collectionId={collectionId} />;
        break;

      case ECollectionSettingTabs.AUTH:
        return <Auth project={project} collectionId={collectionId} />;

        break;
      case ECollectionSettingTabs.SCRIPT:
        return <Scripts project={project} collectionId={collectionId} />;
        break;

      case ECollectionSettingTabs.STATISTICS:
        return <Statistics />;
        break;

      // case ECollectionSettingTabs.SCHEMAS:
      //   return <Schemas collectionId={collectionId} />;
      //   break;
    }
  };

  return <Column className="h-full">{_renderBody()}</Column>;
};

export default SettingBody;

interface ISettingBody {
  project: any; //{} //todo: define a proper type here
  collectionId: string;
  selectedBody: string;
  updateProject: Function;
}
