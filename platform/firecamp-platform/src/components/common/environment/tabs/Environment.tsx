import { memo } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import {
  RootContainer,
  Container,
  Column,
  Row,
  EnvironmentTable,
  TabHeader,
  Button
} from '@firecamp/ui-kit';
import { VscEye } from '@react-icons/all-files/vsc/VscEye';

import { _array, _object } from '@firecamp/utils';

const EnvironmentTab = ({ tab, platformContext }) => {
  // if(isFetchingRequest === true) return <Loader />;
  console.log(tab, platformContext, 'tab...');
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <Container.Header>
          <TabHeader className="height-ex-small bg-statusBarBackground2">
                <TabHeader.Left>
                <div className="fc-urlbar-path flex text-sm">
                  <span>Path</span>
                </div>
                <VscEye size={12} />
                </TabHeader.Left>
                <TabHeader.Right>
                  <Button text="save" primary sm />
                  <Button text="cancel" secondary sm />
                </TabHeader.Right>
          </TabHeader>
        </Container.Header>
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
