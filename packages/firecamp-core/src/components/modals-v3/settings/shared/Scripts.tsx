import { FC, useMemo } from 'react';
import {
  Container,
  Button,
  EButtonColor,
  EButtonSize,
  TabHeader,
  ScriptsTabs,
} from '@firecamp/ui-kit';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';
import { TId, IRestScripts } from '@firecamp/types';

import { IExplorerSettingsUi } from '../types';
import { EPlatformModalTypes } from '../../../../types';

const Scripts: FC<IScriptsSettingUi> = ({
  type = EPlatformModalTypes.CollectionSetting,

  initialPayload,
  scripts: propScripts = {},

  isRequesting = false,
  onUpdate = () => {},
  onChange = (key: string, value: any) => {},
  close = () => {},
}) => {
  let itemId: TId = useMemo(() => initialPayload?._meta.id, [initialPayload]);

  let _onChangeScript = (type, script = '') => {
    if (!type) return;
    onChange('scripts', { [type]: script });
  };

  let _onUpdate = async (e) => {
    if (e) e.preventDefault;
    let updates: any = {},
      updatedScripts =
        _object.difference(propScripts, initialPayload.scripts) || {};
    let updatedKeys = Object.keys(updatedScripts) || [];

    updates['scripts'] = _object.pick(propScripts, updatedKeys);

    try {
      if (_object.size(updates.scripts)) {
        onUpdate(updates);
      }
    } catch (error) {}
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="p-4">
          <ScriptsTabs
            id={itemId}
            key={itemId}
            scripts={propScripts}
            onChangeScript={_onChangeScript}
            allowInherit={type === EPlatformModalTypes.FolderSetting}
          />
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
              onClick={(e) => close()}
              ghost={true}
            />

            <Button
              text={isRequesting ? 'Updating Scripts...' : 'Update Scripts'}
              color={EButtonColor.Primary}
              size={EButtonSize.Small}
              disabled={
                equal(propScripts, initialPayload.scripts) || isRequesting
              }
              onClick={_onUpdate}
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default Scripts;

interface IScriptsSettingUi {
  type:
    | EPlatformModalTypes.CollectionSetting
    | EPlatformModalTypes.FolderSetting;

  initialPayload: IExplorerSettingsUi;
  scripts: IRestScripts; //todo: define a proper type here
  isRequesting?: boolean;
  onUpdate: (updates: { [key: string]: string }) => void;
  onChange: (key: string, value: any) => void;
  close: () => void;
}
