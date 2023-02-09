import { FC, useState } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import {
  Container,
  Button,
  TabHeader,
  EnvironmentTable,
} from '@firecamp/ui-kit';
import { TId, ICollection } from '@firecamp/types';

const Variables: FC<IProps> = ({
  entity,
  isRequesting = false,
  isVariablesChanged = false,
  onUpdate = (vars) => {},
  onChange = (vars) => {},
}) => {
  const [runtimeEnv, setRuntimeEnv] = useState(entity.variables);
  return (
    <Container className="with-divider h-full ">
      <Container.Body>
        <EnvironmentTable rows={[]} onChange={console.log} />
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text={isRequesting ? 'Saving variables...' : 'Save Variables'}
              onClick={() => onUpdate(entity.variables)}
              disabled={!isVariablesChanged || isRequesting}
              primary
              sm
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default Variables;

interface IProps {
  entity: ICollection;
  isRequesting?: boolean;
  isVariablesChanged: boolean;
  onUpdate: (variables: ICollection['variables']) => void;
  onChange: (variables: ICollection['variables']) => void;
}
