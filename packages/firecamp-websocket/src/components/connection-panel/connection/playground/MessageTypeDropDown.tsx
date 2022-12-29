import { Button, Dropdown } from '@firecamp/ui-kit';

const MessageTypeDropDown = ({
  options,
  selectedOption,
  isOpen,
  onToggle,
  onSelect,
}) => {
  return (
    <Dropdown
      isOpen={isOpen}
      selected={selectedOption.name || ''}
      onToggle={onToggle}
    >
      <Dropdown.Handler>
        <div className="flex text-sm items-center">
          {' '}
          Message as
          <Button
            text={selectedOption.name || ''}
            withCaret
            primary
            transparent
            ghost
            xs
            className="ml-1"
          />
        </div>
      </Dropdown.Handler>
      <Dropdown.Options options={options} onSelect={onSelect} />
    </Dropdown>
  );
};

export default MessageTypeDropDown;
