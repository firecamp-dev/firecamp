import { FC } from 'react';
import { Button, Column } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { AiOutlineUsergroupAdd } from '@react-icons/all-files/ai/AiOutlineUsergroupAdd';
import { AiOutlineUpload } from '@react-icons/all-files/ai/AiOutlineUpload';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';

import platformContext from '../../../services/platform-context';
import { EUserRolesWorkspace } from '../../../types';
import { useUserStore } from '../../../store/user';
import { usePlatformStore, EPlatformScope } from '../../../store/platform';

const CollabButton: FC<any> = () => {
  const isGuest = useUserStore((s) => s.isGuest, shallow);
  const platformScope = usePlatformStore((s) => s.scope, shallow);

  const _renderButton = (userRole) => {
    if (isGuest) {
      return (
        <Button
          text="save my workspace"
          icon={<AiOutlineUpload className="mr-2 toggle-arrow" size={16} />}
          onClick={(e) => platformContext.app.modals.openSignIn()}
          secondary
          iconLeft
          transparent
          sm
        />
      );
    } else if (platformScope == EPlatformScope.Person) {
      return (
        <Button
          text="create organization"
          icon={<VscAdd className="mr-2 toggle-arrow" size={12} />}
          onClick={(e) => platformContext.app.modals.openCreateOrg()}
          secondary
          iconLeft
          transparent
          sm
        />
      );
    } else if (
      platformScope == EPlatformScope.Organization &&
      userRole === EUserRolesWorkspace.Owner
    ) {
      return (
        <Button
          text="invite members"
          icon={
            <AiOutlineUsergroupAdd className="ml-2 toggle-arrow" size={12} />
          }
          onClick={(e) => platformContext.app.modals.openInviteMembers()}
          secondary
          iconLeft
          transparent
          sm
        />
      );
    } else return <></>;
  };

  return (
    <Column className="fc-tab-header-right  border-b border-tabBorder ml-auto flex-none bg-transparent w-36 flex items-center justify-end pr-1">
      {_renderButton(1)}
      {/* //TODO used mock data as of now, remove it and use store value here */}
    </Column>
  );
};

export default CollabButton;
