import { useEffect, useState } from 'react';
import { Container, TabHeader, Column, Row } from '@firecamp/ui';

const ResponseSize = ({ size = {} }) => {
  return (
    <Column flex={1} width={200}>
      <Container className="with-divider">
        {/*<Container.Header>
          <TabHeader className="height-small  text-light text-uppercase">
            <TabHeader.Left>Size</TabHeader.Left>
            <TabHeader.Right>{"-"}</TabHeader.Right>
          </TabHeader>
        </Container.Header>*/}
        <Container.Body>
          <Row className="flex-col with-divider">
            {(Object.values(size) || []).map((s: any[], i) => {
              return <Size key={i} sizes={s} index={i} />;
            })}
          </Row>
        </Container.Body>
        <Container.Footer>
          <TabHeader className="height-small"></TabHeader>
        </Container.Footer>
      </Container>
    </Column>
  );
};

export default ResponseSize;

const Size = ({ sizes = [], index = 0 }) => {
  let [totalSize, setTotalSize] = useState(
    (sizes || []).find(
      (s) =>
        s.curlParameter === 'REQUEST_SIZE' ||
        s.curlParameter === 'RESPONSE_SIZE'
    )
  );

  useEffect(() => {
    let newTotalSize = (sizes || []).find(
      (s) =>
        s.curlParameter === 'REQUEST_SIZE' ||
        s.curlParameter === 'RESPONSE_SIZE'
    );
    if (newTotalSize !== totalSize) {
      setTotalSize(newTotalSize);
    }
  }, [sizes]);

  return (
    <Container className="with-divider">
      <Container.Header className="bg-app-background-secondary">
        <TabHeader
          id={`${totalSize.curlParameter}-size`}
          className="height-ex-small  fc-network-header"
          tooltip={totalSize.description || ''}
        >
          <TabHeader.Left>
            {totalSize.parameter || 'Request Size'}
          </TabHeader.Left>
          <TabHeader.Right>
            {`${totalSize.value || 0}  ${totalSize.unit || ''}`}
          </TabHeader.Right>
        </TabHeader>
      </Container.Header>
      <Container.Body className="border-b border-app-border">
        {sizes && Array.isArray(sizes)
          ? (sizes || [])
              .filter(
                (s) =>
                  s.curlParameter !== 'REQUEST_SIZE' &&
                  s.curlParameter !== 'RESPONSE_SIZE'
              )
              .map((resSize, index) => {
                return [
                  <div
                    key={`${totalSize.curlParameter}-info-size-div-${index}`}
                    className="fc-response-item"
                  >
                    <label
                      id={`${totalSize.curlParameter}-info-size-${index}`}
                      data-tip={resSize.description || ''}
                    >
                      {resSize.parameter || ''}
                    </label>
                    <span>{`${resSize.value || ''} ${
                      resSize.unit || ''
                    }`}</span>
                  </div>,
                ];
              })
          : ''}
      </Container.Body>
    </Container>
  );
};
