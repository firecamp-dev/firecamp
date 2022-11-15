//@ts-nocheck

import { useState, useEffect, memo, useContext } from 'react';
import { Container, Column, Tabs } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import shallow from 'zustand/shallow';

import { PANEL } from '../../../../constants';
import LogTable from './LogTable';

import { useWebsocketStore } from '../../../../store';

const Response = ({ visiblePanel = '', setVisiblePanel = () => {}}) => {

  let handleFS = useFullScreenHandle();
  let _setVisiblePanel = (e) => {
    if (e) e.preventDefault;

    if (visiblePanel === PANEL.RESPONSE) {
      setVisiblePanel(PANEL.ALL);
    } else {
      setVisiblePanel(PANEL.RESPONSE);
    }
  };

  return (
    <Column flex={1} className="h-full bg-appBackground2" overflow="auto">
      <FullScreen handle={handleFS}>
        <Container>
          <Container.Header>
            <div
              className="fc-btn-collapse v2"
              onClick={_setVisiblePanel}
            >
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
