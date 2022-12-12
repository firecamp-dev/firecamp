import { useState } from 'react';
import { Container, TabHeader, Dropdown, Button } from '@firecamp/ui-kit';
import { EEmitterPayloadTypes } from '../../../../types';
const EmitterArgMeta = ({
  argTypes = [],
  activeArgType = {},
  typedArrayList = [],
  selectedTypedArray = {},
  isSelectTypeDDOpen = () => { },
  onSelectArgType = () => { },
  toggleSelectArgTypeDD = () => { },
  onSelectTypedArray = () => { }
}) => {
  let [isSelectedTypedArrOpen, toggleSelectedTypedArrOpen] = useState(false);

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
          (activeArgType.id === EEmitterPayloadTypes.arraybuffer ||
            activeArgType.id === EEmitterPayloadTypes.arraybufferview) ? (
          <Dropdown
            isOpen={isSelectedTypedArrOpen}
            selected={selectedTypedArray.name || ''}
            onToggle={() => toggleSelectedTypedArrOpen(!isSelectedTypedArrOpen)}
          >
            <Dropdown.Handler>
              <Button
                text={selectedTypedArray.name || ''}
                transparent={true}
                ghost={true}
                withCaret={true}
                primary
                sm
              />
            </Dropdown.Handler>
            <Dropdown.Options
              options={typedArrayList || []}
              onSelect={onSelectTypedArray}
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
