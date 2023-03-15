import { FC } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { Container, Button, TabHeader, Editor } from '@firecamp/ui';
import { _object } from '@firecamp/utils';

const ImportRaw: FC<IProps> = ({
  id,
  raw,
  isImporting = false,
  importCollection = (raw) => {},
  onChange = (raw) => {},
}) => {
  return (
    <Container className="with-divider h-full ">
      <Container.Body>
        <Editor
          id={id}
          placeholder={'Paste your raw collection here'}
          value={raw}
          onChange={(e) => {
            const {
              target: { value },
            } = e;
            onChange(value);
          }}
        />
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text={
                isImporting ? 'Importing Collection...' : 'Import Collection'
              }
              onClick={importCollection}
              disabled={isImporting}
              primary
              sm
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default ImportRaw;

interface IProps {
  id: string;
  raw: string;
  isImporting?: boolean;
  importCollection: (raw: string) => void;
  onChange: (raw: string) => void;
}
