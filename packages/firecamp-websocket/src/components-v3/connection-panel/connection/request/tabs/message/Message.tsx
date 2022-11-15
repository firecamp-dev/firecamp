import { useState } from 'react';
import { RootContainer } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import shallow from 'zustand/shallow';

import { MESSAGE_PAYLOAD_TYPES } from '../../../../../../constants';
import MessagePlayground from './MessagePlayground';

import {
  useWebsocketStore,
  initialPlaygroundMessage,
} from '../../../../../../store';

const messageTypes = [
  {
    id: MESSAGE_PAYLOAD_TYPES.text,
    name: 'Text',
  },
  {
    id: MESSAGE_PAYLOAD_TYPES.json,
    name: 'JSON',
  },
  {
    id: MESSAGE_PAYLOAD_TYPES.file,
    name: 'File',
  },
  {
    id: MESSAGE_PAYLOAD_TYPES.arraybuffer,
    name: 'Array buffer',
  },
  {
    id: MESSAGE_PAYLOAD_TYPES.arraybufferview,
    name: 'Array buffer view',
  },
  {
    id: 'no_body',
    name: 'No body',
  },
];

const envelopeList = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
];

const Message = ({ tabData = {} }) => {
  let tabId= 123;

  let { meta } = useWebsocketStore((s: any) => ({
    meta: s.request.meta,
  }),shallow);

  let [selectedMessageId, setSelectedMessageId] = useState('');

  return (
    <RootContainer className="h-full">
     <MessagePlayground
            messageTypes={messageTypes}
            envelopeList={envelopeList}
            meta={meta}
            tabData={{id: tabId}}
            selectedMessageId={selectedMessageId}
          />
    </RootContainer>
  );
};
export default Message;
