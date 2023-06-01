import { FC } from 'react';
import { Button, Input, TabHeader, TextArea } from '@firecamp/ui';
import platformContext from '../../../../services/platform-context';

const EditInfoTab: FC<any> = ({
  workspace,
  error,
  isRequesting,
  onSubmit,
  onChange,
  close,
}) => {
  return (
    <div className="py-6 px-3 flex-1 flex flex-col">
      <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
        UPDATE WORKSPACE INFO
      </label>
      <div>
        <Input
          autoFocus={true}
          label="Name"
          placeholder="Workspace name"
          name={'name'}
          defaultValue={workspace.name || ''}
          onChange={onChange}
          onKeyDown={() => {}}
          onBlur={() => {}}
          error={error.name}
          // error={error.name}
          // iconPosition="right"
          // icon={<VscEdit />}
        />
      </div>

      <TextArea
        type="text"
        minHeight="200px"
        label="Description (optional)"
        labelClassName="fc-input-label"
        placeholder="Description"
        note="Markdown supported in description"
        name={'description'}
        defaultValue={workspace.description || ''}
        onChange={onChange}
        // disabled={true}
        // iconPosition="right"
        // icon={<VscEdit />}
      />
      <TabHeader className="!px-0">
        <TabHeader.Left>
          <a
            className="!text-link hover:!text-link hover:underline cursor-pointer text-sm px-2 pl-0"
            target="_blank"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              platformContext.app.modals.openInviteMembers();
            }}
          >
            Invite New Members
          </a>
        </TabHeader.Left>
        <TabHeader.Right>
          <Button
            text="Cancel"
            onClick={(e) => close(e)}
            transparent
            secondary
            ghost
            sm
          />
          <Button
            text={isRequesting ? 'Updating...' : 'Update'}
            onClick={onSubmit}
            disabled={isRequesting}
            primary
            sm
          />
        </TabHeader.Right>
      </TabHeader>
    </div>
  );
};
export default EditInfoTab;
