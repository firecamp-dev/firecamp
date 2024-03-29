import { FC, useEffect, useState } from 'react';
import { _array } from '@firecamp/utils';
import { Container, Drawer, IModal, ProgressBar } from '@firecamp/ui';
import InvitationCard from './InvitationCard';
import platformContext from '../../../services/platform-context';
import { IInvite } from './InvitationCard.interface';
import { Rest } from '@firecamp/cloud-apis';

const AllInvitation: FC<IModal> = ({ opened, onClose }) => {
  const [list, updateList] = useState<Array<IInvite> | []>([]);
  const [inviteId, updateInviteId] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);

    Rest.invitation
      .getMyPendingInvitations()
      .then((res) => res.data)
      .then((res) => {
        const { error } = res;
        if (!error) {
          updateList(res);
        }
      })
      .finally(() => setIsFetching(false));
  }, []);

  const switchToWrs = async (wrs: any, org: any) => {
    await platformContext.app.switchWorkspace(wrs, org);
    platformContext.app.modals.close();
  };

  const _handleInvitation = async (invite: IInvite) => {
    if (isRequesting) return;

    setIsRequesting(true);
    updateInviteId(invite.token);

    Rest.invitation
      .accept(invite.token)
      .then((res) => res.data)
      .then(({ flag, data, message }) => {
        if (flag) {
          const { org, workspace } = data;
          platformContext.app.notify.success(
            'You have successfully joined the invitation'
          );

          platformContext.window.confirm({
            message:
              'Congratulations on joining the invitation! Are you interested in switching workspaces and start collaboration?',
            labels: { confirm: 'Yes, switch workspace.' },
            onConfirm: () => switchToWrs(workspace, org),
            onCancel: () => {
              setIsRequesting(false);
              updateInviteId('');
            },
          });

          let Index = list.findIndex((i) => i.token === invite.token);
          updateList((list) => [
            ...list.slice(0, Index),
            ...list.slice(Index + 1),
          ]);
        } else {
          platformContext.app.notify.alert(message);
        }
      })
      .catch((e) => {
        platformContext.app.notify.alert(e.response?.data.message || e.message);
      })
      .finally(() => {
        setIsRequesting(false);
        updateInviteId('');
      });
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size={600}
      title={
        <div className="text-lg leading-5 px-3 flex items-center font-medium">
          All Invitation
        </div>
      }
    >
      <Container className="py-4">
        <ProgressBar active={isFetching} />
        {!isFetching ? (
          <Container.Body>
            {!_array.isEmpty(list) ? (
              list.map((invite, index) => (
                <InvitationCard
                  key={index}
                  inviterName={invite.inviterName}
                  orgName={invite.orgName}
                  workspaceName={invite.workspaceName}
                  role={invite.role}
                  isRequesting={isRequesting}
                  disabled={inviteId.length > 0 && inviteId === invite.token}
                  onAccept={() => _handleInvitation(invite)}
                />
              ))
            ) : (
              <NoInvitationFound />
            )}
          </Container.Body>
        ) : (
          <></>
        )}
      </Container>
    </Drawer>
  );
};
export default AllInvitation;

const NoInvitationFound = () => {
  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <div className="text-sm max-w-xs mx-auto text-center px-10">
        <label className="font-semibold text-app-foreground uppercase">
          No Invitation Found
        </label>
        <span className="block font-normal text-app-foreground-inactive">
          You do not have any new invitations at this time.
        </span>
      </div>
    </div>
  );
};
