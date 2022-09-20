import { useHotkeys } from 'react-hotkeys-hook';

import RequestPanel from './RequestPanel';
import { Container, Column } from '@firecamp/ui-kit';

const Request = ({ tab, getFirecampAgent = () => {} }) => {
  useHotkeys(`cmd+h`, (k, e) => console.log('This is the cmd+h', k, e));

  return (
    <Column
      height={'100%'}
      flex={1}
      minWidth="20%"
      maxWidth={'80%'}
      overflow="visible"
      width={'50%'}
    >
      <Container className="with-divider">
        <Container.Body overflow="visible" className="h-full">
          <RequestPanel tab={tab} getFirecampAgent={getFirecampAgent} />
        </Container.Body>
      </Container>
    </Column>
  );
};

export default Request;
