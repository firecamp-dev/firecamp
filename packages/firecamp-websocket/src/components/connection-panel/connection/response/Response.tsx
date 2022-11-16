
import { memo } from 'react';
import { Container, Column } from '@firecamp/ui-kit';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import LogTable from './LogTable';
import { EPanel } from '../../../../constants';

const Response = ({ visiblePanel = '', setVisiblePanel = (_) => {} }) => {
  const handleFS = useFullScreenHandle();
  const _setVisiblePanel = (e) => {
    if (e) e.preventDefault;

    if (visiblePanel === EPanel.Response) {
      setVisiblePanel(EPanel.All);
    } else {
      setVisiblePanel(EPanel.Response);
    }
  };

  return (
    <Column flex={1} className="h-full bg-appBackground2" overflow="auto">
      <FullScreen handle={handleFS}>
        <Container>
          <Container.Header>
            <div className="fc-btn-collapse v2" onClick={_setVisiblePanel}>
              <span className="icon-caret"></span>
            </div>
          </Container.Header>
          <Container.Body>
            <LogTable />
          </Container.Body>
        </Container>
      </FullScreen>
    </Column>
  );
};

export default memo(Response);
