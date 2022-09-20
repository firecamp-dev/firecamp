import { FC, useState } from 'react';
import {
  Input,
  TextArea,
  TabHeader,
  Button,
  EButtonColor,
  EButtonSize,
  Container,
} from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';
import equal from 'deep-equal';
import { IExplorerSettingsUi } from '../types';
import { EPlatformModalTypes } from '../../../../types';

const EditInfo: FC<IEditInfoUi> = ({
  type = EPlatformModalTypes.CollectionSetting,

  name,
  description,

  isRequesting,
  onUpdate,
  onChange,
  close,
  initialPayload,
}) => {
  const [error, setError] = useState({ name: '' });

  let _handleChange = (e) => {
    if (e) e.preventDefault();
    let { name, value } = e.target;
    if (name === 'name' && error.name) setError({ name: '' });

    onChange(name, value);
  };

  let _onUpdate = async (e) => {
    if (e) e.preventDefault;
    // console.log({ name });

    if (!name || name.length < 3) {
      setError({
        name: `The ${
          type === EPlatformModalTypes.CollectionSetting
            ? 'collection'
            : 'folder'
        } name must have minimun 3 characters`,
      });
      return;
    }

    let updates: any =
      _object.difference(
        { name, description },
        {
          name: initialPayload.name,
          description: initialPayload.description,
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
      <Container.Body>
        <Container className="pt-16 padding-wrapper">
          <div className="p-6 flex-1 flex flex-col">
            <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
              {`UPDATE ${
                type === EPlatformModalTypes.CollectionSetting
                  ? 'COLLECTION'
                  : 'FOLDER'
              } INFO`}
            </label>
            <div className="mt-8">
              <Input
                autoFocus={true}
                label="Name"
                placeholder={`${
                  type === EPlatformModalTypes.CollectionSetting
                    ? 'Collection'
                    : 'folder'
                } name'`}
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
              labelClassname="fc-input-label"
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
        </Container>
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text="Cancel"
              color={EButtonColor.Secondary}
              transparent={true}
              size={EButtonSize.Small}
              onClick={() => close()}
              ghost={true}
            />
            <Button
              text={isRequesting ? 'Updating Info...' : 'Update Info'}
              color={EButtonColor.Primary}
              size={EButtonSize.Small}
              onClick={_onUpdate}
              disabled={
                equal(
                  {
                    name: initialPayload.name,
                    description: initialPayload.description,
                  },
                  { name, description }
                ) || isRequesting
              }
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>{' '}
    </Container>
  );
};
export default EditInfo;

interface IEditInfoUi {
  type:
    | EPlatformModalTypes.CollectionSetting
    | EPlatformModalTypes.FolderSetting;
  initialPayload: IExplorerSettingsUi;

  name: string;
  description: string;

  isRequesting?: boolean;
  onUpdate: (updates: { [key: string]: string }) => void;
  onChange: (key: string, value: any) => void;
  close: () => void;
}
