import { FC } from 'react';
import { Notes } from '@firecamp/ui';
import { EUserRolesWorkspace } from '../../../../types';

const RoleOptions = [
  {
    id: EUserRolesWorkspace.Admin,
    name: 'Admin',
    description: `
        1. Can Rename Workspace <br/>
        2. Can Manage Members = Invite Members, Remove Members <br/>
        3. Can Manage Collection - Create/Update/Delete/View Collections and Their child components like Folder, Requests, etc.
        `,
  },
  {
    id: EUserRolesWorkspace.Collaborator,
    name: 'Collaborator',
    description: `
      1. Can Manage Collection <br/>
      - Create/Update/Delete/View Collections and Their child component like Folder, Requests, etc. <br/>
      2. Can not Rename. Update, Delete Workspace
      `,
  },
  // {
  //   name: 'Viewer (Coming soon)',
  //   description: `
  //   1. Can only view Workspace, Collections, and Their child component like Folder, Requests, etc. <br/>
  //   2. Can not perform any actions like Create, Update, or Delete for any components.
  //   `,
  // },
];

const RolesCallout: FC<{ role: number }> = ({ role }) => {
  const _role = RoleOptions.find((r) => r.id == role);

  return (
    <Notes
      title={_role.name}
      description={_role.description}
      className={'mb-3 w-[32rem]'}
    />
  );
};
export default RolesCallout;
