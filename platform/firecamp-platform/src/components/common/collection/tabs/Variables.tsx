import { FC } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import {
  Container,
  Button,
  TabHeader,
  EnvironmentTable,
} from '@firecamp/ui';
import { ICollection } from '@firecamp/types';

const Variables: FC<IProps> = ({
  entity,
  isRequesting = false,
  isVarsChanged = false,
  onUpdate = (vars) => {},
  onChange = (vars) => {},
}) => {
  console.log(entity.variables, 'in variables');
  return (
    <Container className="with-divider h-full ">
      <Container.Body>
        <EnvironmentTable rows={entity.variables} onChange={onChange} />
      </Container.Body>
      <Container.Footer className="py-3">
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text={isRequesting ? 'Saving variables...' : 'Save Variables'}
              onClick={() => onUpdate(entity.variables)}
              disabled={!isVarsChanged || isRequesting}
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
  isVarsChanged?: boolean;
  onUpdate: (variables: ICollection['variables']) => void;
  onChange: (variables: ICollection['variables']) => void;
}
