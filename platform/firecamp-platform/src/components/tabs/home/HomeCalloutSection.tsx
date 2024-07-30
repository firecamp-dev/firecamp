import { shallow } from 'zustand/shallow';
import platformContext from '../../../services/platform-context';
import { EPlatformScope, usePlatformStore } from '../../../store/platform';
import { useWorkspaceStore } from '../../../store/workspace';
import { useUserStore } from '../../../store/user';

const CalloutSection = () => {
  const { workspace } = useWorkspaceStore(
    (s) => ({
      workspace: s.workspace,
    }),
    shallow
  );
  const { scope, organization } = usePlatformStore(
    (s) => ({
      scope: s.scope,
      organization: s.organization,
    }),
    shallow
  );
  const { user, isGuest } = useUserStore(
    (s) => ({
      user: s.user,
      isGuest: s.isGuest,
    }),
    shallow
  );

  if (isGuest) {
    return (
      <CalloutBox
        title={"You're using Firecamp as Guest"}
        description={`You can test various requests and experience the power of API platform. However, to take advantage of all features, sign up for a full account. You'll be able to create collections, save requests, and collaborate with your team. Sign in now to unleash the full potential of API Campsite!`}
        actionText={'Sign In or Sign Up in Firecamp'}
        action={() => platformContext.app.modals.openSignIn()}
      />
    );
  }

  if (scope == EPlatformScope.Person) {
    return (
      <CalloutBox
        title={"You're right now in your personal workspace"}
        description={`The personal workspace is not meant to work collaboratively, for now, you can create an organization and invite your team/colleagues to work collaboratively.`}
        actionText={'create an organization'}
        action={() => platformContext.platform.createOrganizationPrompt()}
      />
    );
  }

  // TODO: set role based condition here, if role is owner or admin then only show this callout message
  const workspaceName = workspace.name;
  const orgName = organization.name;
  return (
    <CalloutBox
      title={`You're in the ${workspaceName} workspace of the ${orgName} organization.`}
      description={`You can invite your team/colleagues to this workspace to work collaboratively.`}
      actionText={'invite members'}
      action={() => platformContext.app.modals.openInviteMembers()}
    />
  );
};

const CalloutBox = ({
  title = '',
  description = '',
  actionText = '',
  action = () => {},
}) => {
  return (
    <div className="flex flex-col border border-app-border rounded-sm p-4 m-auto">
      <p className={'text-base font-semibold mb-2 mt-1'}>{title}</p>
      <p className="text-base text-app-foreground-inactive mb-2">
        {description}
      </p>
      <a
        href=""
        className="text-base font-semibold !text-info cursor-pointer mb-2"
        onClick={(e) => {
          e.preventDefault();
          action();
        }}
      >
        {actionText}
      </a>
    </div>
  );
};

export { CalloutSection };
