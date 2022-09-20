// @ts-nocheck
import { FC } from 'react';
import shallow from 'zustand/shallow';
import { Column } from '@firecamp/ui-kit';

import Edit from './workspace/Edit';
import Environment from '../../collection-setting/body/environment/Environment';
import Import from './import/Import';
import { EWorkspaceSettingTabs } from '../../../../constants';

const Body: FC<IBody> = ({
  workspace = {},
  originalWRS = {},
  meta = {},
  activeTab = '',
  onClose = () => {},
  updateWorkspaceData = () => {},
}) => {
  let mwRelation = ''; /*  memberRelationsStore(
    state => state[mRelarionsConsts.ACTIONS.GET_BY_USER_ID](F.userMeta.id),
    shallow
  ); */

  const _renderBody = () => {
    // console.log(`workspace`, workspace);
    switch (activeTab) {
      case EWorkspaceSettingTabs.SETTING:
        return (
          <Edit
            mWRelation={mwRelation}
            updateWorkspaceData={updateWorkspaceData}
            originalWRS={originalWRS}
            workspace={workspace}
            onClose={onClose}
          />
        );
        break;
      case EWorkspaceSettingTabs.ENVIRONMENT:
        return (
          <Environment
            workspace={workspace}
            collectionId={'global'}
            meta={{
              showHeader: true,
              header: 'Environments',
              ...meta,
            }}
          />
        );
        break;
      case EWorkspaceSettingTabs.IMPORT:
        return <Import onClose={onClose} />;
        break;
      default:
        return (
          <Edit
            mWRelation={mwRelation}
            updateWorkspaceData={updateWorkspaceData}
            originalWRS={originalWRS}
            workspace={workspace}
            onClose={onClose}
          />
        );
    }
  };

  return <Column className="h-full">{_renderBody()}</Column>;
};

export default Body;

interface IBody {
  workspace: any; //{}
  originalWRS: any; //{}
  meta: any; //{}
  activeTab: string;
  onClose: Function;
  updateWorkspaceData: Function;
}
