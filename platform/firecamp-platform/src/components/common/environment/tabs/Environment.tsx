import { memo } from 'react';
import isEqual from 'react-fast-compare';
import {
  Container,
  Row,
  RootContainer,
  Column,
  EnvironmentTable,
} from '@firecamp/ui-kit';
import { _array, _object } from '@firecamp/utils';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';

const EnvironmentTab = ({ tab, platformContext, activeTab }) => {
  // if(isFetchingRequest === true) return <Loader />;
  console.log(tab, platformContext, activeTab, 'tab...');
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <Container.Body>
          <Row flex={1} overflow="auto" className="with-divider h-full">
            {/* <span>This is the Environment Tab</span> */}
            <Column>
              <EnvironmentTable onChange={console.log} />
            </Column>
          </Row>
        </Container.Body>
      </Container>
    </RootContainer>
  );
};

export default memo(EnvironmentTab, (p, n) => !isEqual(p, n));
