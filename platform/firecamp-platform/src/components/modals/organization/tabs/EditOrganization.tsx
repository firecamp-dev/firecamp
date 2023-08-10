import { FC } from 'react';
import { useForm } from '@mantine/form';
import { Info } from 'lucide-react';
import { IOrganization } from '@firecamp/types';
import { Button, Container, Input, TabHeader, TextArea } from '@firecamp/ui';
import { Regex } from '../../../../constants';

interface IEditOrganization {
  organization: Partial<IOrganization>;
  isRequesting: boolean;
  handleSubmit: (v: Partial<IOrganization>) => void;
  disabled?: boolean;
}
const EditOrganization: FC<IEditOrganization> = ({
  organization,
  isRequesting = false,
  handleSubmit,
  disabled = false,
}) => {
  const { onSubmit, getInputProps, values, setValues } = useForm({
    initialValues: {
      name: organization.name,
      description: organization.description,
    },
    validate: {
      name: (value) =>
        !value.length || value.length < 4
          ? 'The organization name must have minimum 4 characters'
          : !Regex.OrgName.test(value)
          ? 'The org name must not contain any spaces or special characters.'
          : null,
    },
  });

  const handleReset = () => {
    setValues({
      name: organization.name,
      description: organization.description,
    });
  };

  const enableReset =
    !disabled &&
    (values.name !== organization.name ||
      values.description !== organization.description);

  return (
    <Container className="py-6 px-3 flex-1 flex flex-col h-full">
      <Container.Body>
        <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative mb-4">
          UPDATE ORGANIZATION INFO
        </label>
        <form onSubmit={onSubmit(handleSubmit)}>
          <Input
            label="Name"
            placeholder="Organization name"
            name={'name'}
            disabled={disabled}
            data-autofocus={!disabled}
            classNames={{ root: '!mb-3' }}
            {...getInputProps('name')}
          />

          <TextArea
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
          <TabHeader.Left></TabHeader.Left>
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
export default EditOrganization;
