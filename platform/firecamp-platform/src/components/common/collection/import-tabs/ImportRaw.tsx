import { FC } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { Container, Button, TabHeader, Editor } from '@firecamp/ui';
import { _object } from '@firecamp/utils';

const ImportRaw: FC<IProps> = ({
  id,
  raw,
  isRequesting = false,
  importCollection = (raw) => {},
  onChange = (raw) => {},
}) => {
  return (
    <Container className="with-divider h-full ">
      <Container.Body>
        <Editor
          value={raw}
          id={id}
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
                isRequesting ? 'Importing Collection...' : 'Import Collection'
              }
              onClick={() => importCollection(raw)}
              disabled={isRequesting}
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
  isRequesting?: boolean;
  importCollection: (raw: string) => void;
  onChange: (raw: string) => void;
}
