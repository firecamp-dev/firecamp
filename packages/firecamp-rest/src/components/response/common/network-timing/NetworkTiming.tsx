import ResponseMetaData from '../response-meta/ResponseMetaData';
import { Container, Row, ResStatus, Popover } from '@firecamp/ui-kit';

import Network from './Network';
import ResponseSize from './ResponseSize';
import './NetworkTiming.sass';

import Statuses from '../../../common/responseStatus.json';
import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

let _getStatusObj = (status) => {
  return Statuses[status] || { status, color: 'gray', text: 'custom' };
};

const NetworkTiming = ({ tabId = '', response, isRequestRunning = false }) => {
  return (
    <Popover
      content={
        _misc.firecampAgent() === EFirecampAgent.desktop &&
        !isRequestRunning &&
        !response.error ? (
          <div className="fc-popover-v2 without-padding">
            <Container className="with-divider">
              <Container.Header>
                <div className="fc-network-response">
                  {/* <span className="fc-success">{response.status || ''} OK</span> */}
                  <ResStatus
                    {..._getStatusObj(response.status)}
                    isRequestRunning={isRequestRunning}
                  />
                  {/*   The server successfully returned the request. */}
                </div>
              </Container.Header>
              <Container.Body>
                <Row className="with-divider">
                  <Network
                    times={response.times || []}
                    network={response.network || []}
                  />
                  <ResponseSize size={response.size || {}} />
                </Row>
              </Container.Body>
            </Container>
          </div>
        ) : (
          ''
        )
      }
    >
      <Popover.Handler id={`network-info-${tabId}`}>
        <ResponseMetaData />
      </Popover.Handler>
    </Popover>
  );
};

export default NetworkTiming;
