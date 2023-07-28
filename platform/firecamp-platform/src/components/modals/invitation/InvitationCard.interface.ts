export interface IInvite {
  inviterName: string;
  orgName: string;
  workspaceName: string;
  role: number;
  token?: string;
}

export type IInvitationCard = IInvite & {
  disabled: boolean;
  onAccept: () => void;
  isRequesting: boolean;
};
