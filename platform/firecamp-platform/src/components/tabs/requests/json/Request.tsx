import { useEffect } from 'react';
import { Container, Row, RootContainer, Column } from '@firecamp/ui';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { _array, _object } from '@firecamp/utils';
import { shallow } from 'zustand/shallow';

const Request = ({ tab, platformContext }) => {
  // if(isFetchingRequest === true) return <Loader />;
  console.log(tab, 'tab...');
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <Container.Body>
          <Row flex={1} overflow="auto" className="with-divider h-full"></Row>
        </Container.Body>
      </Container>
    </RootContainer>
  );
};

export default Request;
