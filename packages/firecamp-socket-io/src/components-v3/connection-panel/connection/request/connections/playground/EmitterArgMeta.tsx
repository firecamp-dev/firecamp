//@ts-nocheck

import { useState } from 'react';
import { Container, TabHeader, Dropdown, Button, EButtonColor, EButtonSize } from '@firecamp/ui-kit';
import { EMITTER_PAYLOAD_TYPES } from '../../../../../../constants';
const EmitterArgMeta = ({
  argTypes = [],
  activeArgType = {},
  envelopeList = [],
  selectedEnvelope = {},
  isSelectTypeDDOpen = () => { },
  onSelectArgType = () => { },
  toggleSelectArgTypeDD = () => { },
  onSelectEnvelope = () => { }
}) => {
  let [isSelectedEnvelopeOpen, toggleSelectedEnvelopeOpen] = useState(false);

  return (
    <Container.Header>
      <TabHeader.Left>
        <Dropdown
          selected={activeArgType.name || ''}
          isOpen={isSelectTypeDDOpen}
          onToggle={() => toggleSelectArgTypeDD(!isSelectTypeDDOpen)}
        >
          <Dropdown.Handler>
            <Button
              text={activeArgType.name || ''}
              transparent={true}
              ghost={true}
              withCaret={true}
              primary
              sm
            />
          </Dropdown.Handler>
          <Dropdown.Options
            options={argTypes || []}
            onSelect={onSelectArgType}
          />
        </Dropdown>
        {activeArgType &&
          (activeArgType.id === EMITTER_PAYLOAD_TYPES.arraybuffer ||
            activeArgType.id === EMITTER_PAYLOAD_TYPES.arraybufferview) ? (
          <Dropdown
            isOpen={isSelectedEnvelopeOpen}
            selected={selectedEnvelope.name || ''}
            onToggle={() => toggleSelectedEnvelopeOpen(!isSelectedEnvelopeOpen)}
          >
            <Dropdown.Handler>
              <Button
                text={selectedEnvelope.name || ''}
                transparent={true}
                ghost={true}
                withCaret={true}
                primary
                sm
              />
            </Dropdown.Handler>
            <Dropdown.Options
              options={envelopeList || []}
              onSelect={onSelectEnvelope}
            />
          </Dropdown>
        ) : (
          ''
        )}
      </TabHeader.Left>
    </Container.Header>
  );
};

export default EmitterArgMeta;
