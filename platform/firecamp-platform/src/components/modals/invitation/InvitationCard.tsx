import { FC } from 'react';
import { Button, TabHeader } from '@firecamp/ui';
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
  disabled = false,
  isRequesting = false,
  onAccept,
}) => {
  const userRole = RoleOptions.find((r) => r.id == role);
  // console.log(`user.role`, userRole, role);

  return (
    <div className="bg-app-background p-4 shadow-sm rounded border mb-4">
      {/* <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative py-4">
        NEW INVITATION
      </label> */}
      <div className="my-4">
        <span className="font-semibold">{inviterName}</span>
        <span> has invited you to collaborate on the </span>
        <span className="font-semibold">{orgName}</span>
        <span>/</span>
        <span className="font-semibold">{workspaceName}</span>
        <span> as </span>
        <span className="font-semibold">{userRole?.name}</span>
      </div>
      <TabHeader className="!px-0">
        <TabHeader.Right>
          <Button
            text={isRequesting ? 'Accepting...': 'Accept Invitation'}
            disabled={disabled}
            onClick={() => onAccept()}
            primary
            xs
          />
        </TabHeader.Right>
      </TabHeader>
    </div>
  );
};

export default InvitationCard;
