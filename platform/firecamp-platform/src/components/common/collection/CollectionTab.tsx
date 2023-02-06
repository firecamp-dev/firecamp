import { memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import {
  RootContainer,
  Container,
  Column,
  Row,
  Loader,
  TabHeader,
  Button,
} from '@firecamp/ui-kit';
import { _array, _object } from '@firecamp/utils';

const CollectionTab = ({ tab, platformContext: context }) => {
  const initEnv = _cloneDeep({ ...tab.entity, variables: [] });
  const [isFetchingEnv, setIsFetchingEnvFlag] = useState(false);
  const [hasChange, setHasChangeFlag] = useState(false);

  // if (isFetchingEnv === true) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <Container.Header>
          <TabHeader className="height-ex-small bg-statusBarBackground2 !pl-3 !pr-3">
            <TabHeader.Left>
              <div className="fc-urlbar-path flex text-base">
                Collection Tab
              </div>
              {/* <VscEdit size={12} onClick={rename} className="pointer" /> */}
            </TabHeader.Left>
            <TabHeader.Right>
              {/* <Button text="Save" primary sm /> */}
              {/* <Button text="Delete" secondary sm disabled={false} /> */}
            </TabHeader.Right>
          </TabHeader>
        </Container.Header>
        <Container.Body>
          <Row flex={1} overflow="auto" className="with-divider h-full">
            <Column></Column>
          </Row>
        </Container.Body>
      </Container>
    </RootContainer>
  );
};

export default memo(CollectionTab, (p, n) => !isEqual(p, n));
