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
        dropdown: 'border-focusBorder !py-0 -mt-1',
        item: '!text-sm !leading-[18px] !px-2 !py-1',
      }}
      width={144}
      menuProps={{
        position: 'bottom-start',
      }}
    />
  );
};

export default TypedArrayViewDropDown;
