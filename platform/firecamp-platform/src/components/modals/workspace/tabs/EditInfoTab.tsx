import { FC } from 'react';
import { Button, Container, Input, TabHeader, TextArea } from '@firecamp/ui';
import platformContext from '../../../../services/platform-context';

const EditInfoTab: FC<any> = ({
  workspace,
  error,
  isRequesting,
  onSubmit,
  onChange,
  close,
  disabled
}) => {
  return (
    <Container className="pt-3 px-3 flex-1 flex flex-col h-full">
      <Container.Body>
        <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative mb-2">
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
            wrapperClassName="!mb-3"
          />
        </div>

        <TextArea
          type="text"
          minHeight="240px"
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
      </Container.Body>
      <Container.Footer>
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
            <Button text="Cancel" onClick={(e) => close(e)} ghost xs />
            <Button
              text={isRequesting ? 'Updating...' : 'Update'}
              onClick={onSubmit}
              disabled={isRequesting || disabled}
              primary
              xs
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};
export default EditInfoTab;
