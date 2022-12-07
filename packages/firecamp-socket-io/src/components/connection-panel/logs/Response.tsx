import { useState, memo } from 'react';
import { Column } from '@firecamp/ui-kit';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import ResponseBody from './ResponseBody';
import { EPanel } from '../../../types'

const Response = ({
  visiblePanel = '',
  setVisiblePanel = (type) => {},
  eventsList = [],
}) => {

  const [messagesAlignment] = useState('center');

  const _setVisiblePanel = (e) => {
    if (e) e.preventDefault;
    if (visiblePanel === EPanel.Response) {
      setVisiblePanel(EPanel.All);
    } else {
      setVisiblePanel(EPanel.Response);
    }
  };

  const handleFS = useFullScreenHandle();

  return (
    <Column flex={1} className="h-full bg-appBackground2" overflow="auto">
      <FullScreen handle={handleFS} className="h-full">
      <ResponseBody align={messagesAlignment} eventsList={eventsList} />
      </FullScreen>
    </Column>
  );
};

export default memo(Response);
