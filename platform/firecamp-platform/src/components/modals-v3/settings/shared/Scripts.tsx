import { FC, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import { Container, Button, TabHeader, ScriptTab } from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';
import { TId, IScript } from '@firecamp/types';
import { EPlatformModalTypes } from '../../../../types';

const Scripts: FC<IScriptsSettingUi> = ({
  type = EPlatformModalTypes.CollectionSetting,
  entity,
  scripts: propScripts,
  snippets,
  isRequesting = false,
  onUpdate = () => {},
  onChange = (key: string, value: any) => {},
}) => {
  const itemId: TId = useMemo(() => entity?.__ref.id, [entity]);
  const _onChangeScript = (type, script = '') => {
    if (!type) return;
    onChange('scripts', { [type]: script });
  };
  const _onUpdate = async (e) => {
    if (e) e.preventDefault;
    let updates: any = {},
      updatedScripts = _object.difference(propScripts, entity.scripts) || {};
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
        <ScriptTab
          id={itemId}
          script={''}
          snippets={snippets}
          onChangeScript={_onChangeScript}
        />
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text="Cancel"
              onClick={(e) => {}}
              secondary
              transparent
              ghost
              sm
            />
            <Button
              text={isRequesting ? 'Updating Scripts...' : 'Update Scripts'}
              onClick={_onUpdate}
              disabled={isEqual(propScripts, entity.scripts) || isRequesting}
              primary
              sm
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
  scripts: IScript[];
  isRequesting?: boolean;
  onUpdate: (updates: { [key: string]: string }) => void;
  onChange: (key: string, value: any) => void;
  snippets: any;
}
