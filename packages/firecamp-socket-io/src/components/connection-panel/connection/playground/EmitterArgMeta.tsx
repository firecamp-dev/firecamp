import { useState } from 'react';
import { Container, TabHeader, Dropdown, Button } from '@firecamp/ui-kit';
import { EEmitterPayloadTypes } from '../../../../types';
const EmitterArgMeta = ({
  argTypes = [],
  activeArgType = {},
  typedArrayList = [],
  selectedTypedArray = {},
  isSelectTypeDDOpen = () => {},
  onSelectArgType = () => {},
  toggleSelectArgTypeDD = () => {},
  onSelectTypedArray = () => {},
}) => {

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
      </TabHeader.Left>
    </Container.Header>
  );
};

export default EmitterArgMeta;
