import { useState, memo } from 'react';
import { Container, Column } from '@firecamp/ui-kit';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { PANEL } from '../../../../constants';

import ResponseBody from './ResponseBody';

const Response = ({
  visiblePanel = '',
  setVisiblePanel = (type) => {},
  eventsList = [],
}) => {

  const [messagesAlignment] = useState('center');

  const _setVisiblePanel = (e) => {
    if (e) e.preventDefault;
    if (visiblePanel === PANEL.RESPONSE) {
      setVisiblePanel(PANEL.ALL);
    } else {
      setVisiblePanel(PANEL.RESPONSE);
    }
  };

  const handleFS = useFullScreenHandle();

  return (
    <Column flex={1} className="h-full bg-appBackground2" overflow="auto">
      <FullScreen handle={handleFS} className="h-full">
        <Container>
          <Container.Body>
            <ResponseBody align={messagesAlignment} eventsList={eventsList} />
          </Container.Body>
        </Container>
      </FullScreen>
    </Column>
  );
};

export default memo(Response);
