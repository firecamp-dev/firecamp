import { FC } from 'react';
import { useForm } from '@mantine/form';
import { Info } from 'lucide-react';
import { IWorkspace } from '@firecamp/types';
import { Button, Container, Input, TabHeader, TextAreav2 } from '@firecamp/ui';
import platformContext from '../../../../services/platform-context';
import { Regex } from '../../../../constants';

interface IEditInfoTab {
  workspace: Partial<IWorkspace>;
  isRequesting: boolean;
  handleSubmit: (v: Partial<IWorkspace>) => void;
  disabled?: boolean;
}
const EditInfoTab: FC<IEditInfoTab> = ({
  workspace,
  isRequesting = false,
  handleSubmit,
  disabled = false,
}) => {
  const { onSubmit, getInputProps, values, setValues } = useForm({
    initialValues: {
      name: workspace.name,
      description: workspace.description,
    },
    validate: {
      name: (value) =>
        !value.length || value.length < 6
          ? 'The workspace name must have minimum 6 characters'
          : !Regex.WorkspaceName.test(value)
          ? 'The workspace name must not contain any spaces or special characters.'
          : null,
    },
  });

  const handleReset = () => {
    setValues({
      name: workspace.name,
      description: workspace.description,
    });
  };

  const enableReset =
    !disabled &&
    (values.name !== workspace.name ||
      values.description !== workspace.description);

  return (
    <Container className="pt-3 px-3 flex-1 flex flex-col h-full">
      <Container.Body>
        <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative mb-2">
          UPDATE WORKSPACE INFO
        </label>
        <form onSubmit={onSubmit(handleSubmit)}>
          <Input
            label="Name"
            placeholder="Workspace name"
            name={'name'}
            disabled={disabled}
            data-autofocus={!disabled}
            classNames={{ root: '!mb-3' }}
            {...getInputProps('name')}
          />

          <TextAreav2
            minRows={10}
            label="Description (optional)"
            placeholder="Description"
            name={'description'}
            disabled={disabled}
            {...getInputProps('description')}
          />
          <div className="text-xs flex items-center justify-start text-app-foreground">
            <Info size={14} className="pr-1" />
            Markdown supported in description
          </div>
        </form>
      </Container.Body>
      <Container.Footer>
        <TabHeader className="!px-0">
          <TabHeader.Left>
            <Button
              onClick={() => {
                platformContext.app.modals.openInviteMembers();
              }}
              text="Invite New Members"
              ghost
              xs
            />
          </TabHeader.Left>
          <TabHeader.Right>
            {enableReset ? (
              <Button text="Undo" onClick={() => handleReset()} ghost xs />
            ) : (
              <></>
            )}
            <Button
              text={isRequesting ? 'Updating...' : 'Update'}
              onClick={onSubmit(handleSubmit)}
              disabled={isRequesting || disabled || !enableReset}
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
