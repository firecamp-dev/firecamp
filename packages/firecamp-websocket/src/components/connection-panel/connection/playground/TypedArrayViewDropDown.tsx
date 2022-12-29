import { Button, Dropdown } from '@firecamp/ui-kit';

const TypedArrayViewDropDown = ({
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
        <Button
          text={selectedOption.name}
          transparent
          withCaret
          primary
          sm
          ghost
        />
      </Dropdown.Handler>
      <Dropdown.Options
        options={options}
        onSelect={onSelect}
      />
    </Dropdown>
  );
};

export default TypedArrayViewDropDown;
