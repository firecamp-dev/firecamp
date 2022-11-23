import { Column, Row,RootContainer } from '@firecamp/ui-kit';
import equal from 'deep-equal';

import EmitterPlayground from './playground/EmitterPlayground';
import EmitterCollection from './EmitterCollection';

const Emitter = ({
  _dnp = {},
  collection: prop_collection = {},
  meta = {},
  tabData = {},
  playground = {},
  runtimeActiveConnection = ''
}) => {
  let _setSelectedEmitter = (
    emitter = {
      _meta: { id: '' }
    },
    isEmpty = false,
    setOriginal = false,
    appendExistingPayload = false,
    sendMessage = false
  ) => {
    // console.log(`emitter`, emitter, isEmpty);

    if (
      emitter?._meta?.id &&
      !equal(_dnp.activeEmitter, emitter._meta.id)
    ) {
      // tTODO: add logic to set active playground emitter
    }

    // console.log(`setOriginal`,setOriginal)
    // addCacheEmitter(emitter, setOriginal, appendExistingPayload, sendMessage);
  };

  return (
    <RootContainer className="h-full">
      <Row className="with-divider" flex={1}>
        <EmitterCollection
          collection={prop_collection}
          meta={meta}
          tabData={{
            id: tabData.id || ''
          }}
          _dnp={_dnp}
          isPlaygroundEmpty={
            !(_dnp.active_emitter && _dnp.active_emitter.length)
          }
          setSelectedEmitter={_setSelectedEmitter}
        />
        <Column flex={1} overflow="auto">
          <EmitterPlayground
            playground={playground}
            runtimeActiveConnection={runtimeActiveConnection}
            collection={prop_collection}
            meta={meta}
            _dnp={_dnp}
            tabData={{
              id: tabData.id || ''
            }}
            setSelectedEmitter={_setSelectedEmitter}
          />
        </Column>
      </Row>
    </RootContainer>
  );
};
export default Emitter;
