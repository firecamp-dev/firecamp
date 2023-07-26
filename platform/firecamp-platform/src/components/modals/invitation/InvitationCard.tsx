import { FC } from 'react';
import { Button } from '@firecamp/ui';
import { EUserRolesWorkspace } from '../../../types';
import { IInvitationCard } from './InvitationCard.interface';

const RoleOptions = [
  {
    id: EUserRolesWorkspace.Owner,
    name: 'Owner',
  },
  {
    id: EUserRolesWorkspace.Admin,
    name: 'Admin',
  },
  {
    id: EUserRolesWorkspace.Collaborator,
    name: 'Collaborator',
  },
  {
    id: EUserRolesWorkspace.Viewer,
    name: 'Viewer',
  },
];

const InvitationCard: FC<IInvitationCard> = ({
  inviterName,
  workspaceName,
  orgName,
  role,
  disabled,
  onAccept,
}) => {
  const userRole = RoleOptions.find((r) => r.id == role);
  // console.log(`user.role`, userRole, role);

  return (
    <div className="bg-app-background p-4 shadow-sm rounded border mb-4">
      <div className="flex gap-4 justify-between">
        <p className="text-gray-500 text-sm font-normal w-4/5">
          <span className="font-semibold">{inviterName}</span>
          <span> has invited you to collaborate on the </span>
          <span className="font-semibold">{orgName}</span>
          <span>/</span>
          <span className="font-semibold">{workspaceName}</span>
          <span> as </span>
          <span className="font-semibold">{userRole?.name}</span>
        </p>
        <div className="inline-flex w-fit gap-1">
          <Button
            text={'Accept'}
            onClick={() => onAccept()}
            disabled={disabled}
            loading={disabled}
            primary
            compact
            xs
          />
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
