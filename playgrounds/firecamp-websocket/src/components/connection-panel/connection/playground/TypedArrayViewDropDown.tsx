import { Button, DropdownMenu } from '@firecamp/ui';
import cx from 'classnames';

const TypedArrayViewDropDown = ({
  options,
  selectedOption,
  isOpen,
  onToggle,
  onSelect,
}) => {
  return (
    <DropdownMenu
      handleRenderer={() => (
        <Button
          text={selectedOption.name}
          className={cx({ open: isOpen })}
          transparent
          withCaret
          primary
          sm
          ghost
        />
      )}
      options={options}
      onSelect={onSelect}
      onOpenChange={(v) => onToggle(v)}
      selected={selectedOption.name || ''}
      classNames={{
        dropdown: 'border-focusBorder -mt-1',
      }}
      menuProps={{
        position: 'bottom-start',
      }}
      width={144}
      sm
    />
  );
};

export default TypedArrayViewDropDown;
