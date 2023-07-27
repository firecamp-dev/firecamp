import { FC } from 'react';
import { Button, Container, Input, TabHeader, TextArea } from '@firecamp/ui';

const EditOrganization: FC<any> = ({
  organization,
  error,
  isRequesting,
  onSubmit,
  onChange,
  enableReset = true,
  disabled = false
}) => {
  return (
    <Container className="py-6 px-3 flex-1 flex flex-col h-full">
      <Container.Body>
        <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative mb-4">
          UPDATE ORGANIZATION INFO
        </label>
        <div>
          <Input
            autoFocus={true}
            label="Name"
            placeholder="Organization name"
            name={'name'}
            defaultValue={organization.name || ''}
            onChange={onChange}
            onKeyDown={() => {}}
            onBlur={() => {}}
            error={error.name}
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
          defaultValue={organization.description || ''}
          onChange={onChange}
        />
      </Container.Body>
      <Container.Footer>
        <TabHeader className="!px-0">
          <TabHeader.Left></TabHeader.Left>
          <TabHeader.Right>

            {/* {enableReset ? <Button text="Undo" onClick={(e) => onChange(e, true)} ghost xs /> : <></>} */}
            <Button
              text={isRequesting ? 'Updating...' : 'Update'}
              onClick={onSubmit}
              disabled={isRequesting || disabled  || !enableReset}
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
