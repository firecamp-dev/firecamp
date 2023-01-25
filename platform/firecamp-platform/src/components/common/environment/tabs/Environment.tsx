import {
  Container,
  Row,
  RootContainer,
  Column,
  BasicTable,
} from '@firecamp/ui-kit';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { _array, _object } from '@firecamp/utils';

const EnvironmentTab = ({ tab, platformContext, activeTab }) => {
  // if(isFetchingRequest === true) return <Loader />;
  console.log(tab, 'tab...');
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <Container.Body>
          <Row flex={1} overflow="auto" className="with-divider h-full">
            {/* <span>This is the Environment Tab</span> */}
            <Column>
              <BasicTable onChange={console.log} />
            </Column>
          </Row>
        </Container.Body>
      </Container>
    </RootContainer>
  );
};

export default EnvironmentTab;
