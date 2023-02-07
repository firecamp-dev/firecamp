import { FC, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
  Input,
  TextArea,
  TabHeader,
  Button,
  Container,
} from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';
import { ICollection, IFolder } from '@firecamp/types';

const EditInfo: FC<IEditInfoUi> = ({
  entityType = 'collection',
  entity,
  isRequesting,
  onUpdate,
  onChange,
}) => {
  const { name, description } = entity;
  const [error, setError] = useState({ name: '' });
  const _handleChange = (e) => {
    if (e) e.preventDefault();
    let { name, value } = e.target;
    if (name === 'name' && error.name) setError({ name: '' });

    onChange(name, value);
  };
  const _onUpdate = async (e) => {
    if (e) e.preventDefault;
    // console.log({ name });

    if (!name || name.length < 3) {
      setError({
        name: `The name must have minimum 3 characters`,
      });
      return;
    }

    let updates: any =
      _object.difference(
        { name, description },
        {
          name: entity.name,
          description: entity.description,
        }
      ) || {};

    let updatedKeys = Object.keys(updates) || [];
    updates = _object.pick({ name, description }, updatedKeys);

    try {
      if (_object.size(updates)) {
        onUpdate(updates);
      }
    } catch (error) {
      console.error({
        error,
        API: 'setting.editInfo',
        updates,
      });
    }
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body className="pt-16 padding-wrapper">
        <div className="p-6 flex-1 flex flex-col">
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            {`UPDATE ${
              entityType === 'collection' ? 'COLLECTION' : 'FOLDER'
            } INFO`}
          </label>
          <div className="mt-8">
            <Input
              autoFocus={true}
              label="Name"
              placeholder={`${
                entityType === 'collection' ? 'Collection' : 'folder'
              } name`}
              name={'name'}
              defaultValue={name || ''}
              onChange={_handleChange}
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
            defaultValue={description || ''}
            onChange={_handleChange}
            // disabled={true}
            // iconPosition="right"
            // icon={<VscEdit />}
            className="mb-auto"
          />
        </div>
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text="Cancel"
              onClick={() => close()}
              transparent
              secondary
              ghost
              sm
            />
            <Button
              text={isRequesting ? 'Updating Info...' : 'Update Info'}
              onClick={_onUpdate}
              disabled={
                isEqual(
                  {
                    name: entity.name,
                    description: entity.description,
                  },
                  { name, description }
                ) || isRequesting
              }
              primary
              sm
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};
export default EditInfo;

interface IEditInfoUi {
  entityType: 'collection' | 'folder';
  entity: ICollection | IFolder;
  isRequesting?: boolean;
  onUpdate: (updates: { [key: string]: string }) => void;
  onChange: (key: string, value: any) => void;
}
