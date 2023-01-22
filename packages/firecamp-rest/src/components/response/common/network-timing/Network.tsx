import { FC, useEffect, useState } from 'react';
import { Container, TabHeader, Column, Row } from '@firecamp/ui-kit';
import isEqual from 'react-fast-compare';
import classnames from 'classnames';

const Network = ({ times = [], network = [] }) => {
  const [total, setTotal] = useState(() =>
    times.filter((t) => t.curlEvent === 'TOTAL' || t.curlEvent === 'REDIRECT')
  );

  useEffect(() => {
    const newTotal = times.filter(
      (t) => t.curlEvent === 'TOTAL' || t.curlEvent === 'REDIRECT'
    );
    if (!isEqual(newTotal, total)) {
      setTotal(newTotal);
    }
  }, [times]);

  return (
    <Column flex={2} width={400}>
      <Container className="with-divider">
        <Container.Header>
          <Container className="with-divider">
            <Container.Header className="bg-appBackground2">
              <TabHeader className="height-ex-small fc-network-header">
                <TabHeader.Left>Network</TabHeader.Left>
              </TabHeader>
            </Container.Header>
            <Container.Body>
              {network && Array.isArray(network)
                ? network.map((nw, index) => {
                    return (
                      <div
                        className="network-list-item"
                        key={`network-${index}`}
                      >
                        <div
                          id={`network-info-${index}`}
                          className="network-list-item-parameter"
                          data-tip={nw.description}
                        >
                          {nw.parameter || ''}
                        </div>
                        <div className="network-list-item-value">
                          {nw.value || '-'}
                        </div>
                      </div>
                    );
                  })
                : ''}
            </Container.Body>
          </Container>
        </Container.Header>
        <Container.Body>
          <Container className="with-divider">
            <Container.Header className="bg-appBackground2">
              <TabHeader className="height-ex-small fc-network-header">
                <TabHeader.Left>Event</TabHeader.Left>
                <TabHeader.Right>Time</TabHeader.Right>
              </TabHeader>
            </Container.Header>
            <Container.Body>
              {/* <EventListItem event="Prepare" time="4.77 ms" className="light" />
              <EventListItem
                event="Prepare"
                time="4.77 ms"
                slotStart="0"
                width="5%"
              />*/}
              {times && Array.isArray(times)
                ? (
                    (times || []).filter(
                      (t) =>
                        t.curlEvent !== 'TOTAL' && t.curlEvent !== 'REDIRECT'
                    ) || []
                  ).map((time, index) => {
                    return (
                      <EventListItem
                        key={`times-${index}`}
                        event={time.event || ''}
                        time={`${time.time || '0'} ${time.unit || ''}`}
                        slotStart={`${time.percentage || ''}%`}
                        width={`${time.percentage || ''}%`}
                        description={time.description || ''}
                        curlEvent={time.curlEvent || ''}
                      />
                    );
                  })
                : ''}
            </Container.Body>
          </Container>
        </Container.Body>
        <Container.Footer>
          {total
            ? total.map((t, i) => {
                return [
                  <TabHeader
                    key={`${t.curlEvent}-network-event-div-${i}`}
                    id={`${t.curlEvent}-network-event`}
                    className="height-small text-primaryColor text-uppercase"
                    tooltip={t.description || ''}
                  >
                    <TabHeader.Left>{t.event || '0'}</TabHeader.Left>
                    <TabHeader.Right>{`${t.time || '0'} ${
                      t.unit || ''
                    }`}</TabHeader.Right>
                  </TabHeader>,
                ];
              })
            : ''}
        </Container.Footer>
      </Container>
    </Column>
  );
};

const EventListItem: FC<{
  event: string;
  time: string;
  slotStart: string;
  width: string;
  className?: string;
  description: string;
  curlEvent: string;
}> = ({
  event = '',
  time = '',
  slotStart = '',
  width = '',
  className = '',
  description = '',
  curlEvent = '',
}) => {
  return (
    <Row className="with-divider fc-event-list-item">
      <Column width={120} flex="none">
        <div
          id={`${curlEvent}-network-event`}
          className={classnames('fc-event-list-item-name', className)}
          data-tip={description || ''}
        >
          {event}
        </div>
      </Column>
      <Column>
        <span
          className="fc-event-list-item-progress"
          style={{
            /*  center: slotStart, // todo: check span property */ width: width,
          }}
        ></span>
      </Column>
      <Column width={80} flex="none">
        <div className={classnames('fc-event-list-item-time', className)}>
          {time}
        </div>
      </Column>
    </Row>
  );
};

export default Network;
