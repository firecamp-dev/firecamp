import { FC } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { Container, Button, TabHeader, ScriptTab } from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';
import { TId, IScript, ICollection, IFolder } from '@firecamp/types';

const Scripts: FC<IProps> = ({
  entity,
  scripts,
  snippets,
  isRequesting = false,
  isScriptChanged = false,
  onUpdate = (scripts) => {},
  onChange = (scripts) => {},
}) => {
  const entityId: TId = entity?.__ref.id;
  const _onChange = (script: string) => {
    const _scripts = [{ ...scripts[0], value: script.split('\n') }];
    onChange(_scripts);
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <ScriptTab
          id={entityId}
          script={scripts?.[0].value.join('\n') || ''}
          snippets={snippets}
          onChangeScript={_onChange}
        />
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader className="m-2">
          <TabHeader.Right>
            {/* <Button
              text="Cancel"
              onClick={(e) => {}}
              secondary
              transparent
              ghost
              sm
            /> */}
            <Button
              text={isRequesting ? 'Updating Scripts...' : 'Update Scripts'}
              onClick={() => onUpdate(scripts)}
              disabled={!isScriptChanged || isRequesting}
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

interface IProps {
  entity: ICollection | IFolder;
  scripts: IScript[];
  isRequesting?: boolean;
  isScriptChanged: boolean;
  snippets: any;
  onUpdate: (scripts: IScript[]) => void;
  onChange: (scripts: IScript[]) => void;
}
