import { Button, DropdownMenu } from '@firecamp/ui';
import cx from 'classnames';

const MessageTypeDropDown = ({
  options,
  selectedOption,
  isOpen,
  onToggle,
  onSelect,
}) => {
  return (
    <DropdownMenu
      handleRenderer={() => (
        <div className="flex text-sm items-center">
          {' '}
          Message as
          <Button
            text={selectedOption.name || ''}
            className={cx("ml-1", { open: isOpen })}
            withCaret
            primary
            transparent
            ghost
            xs
          />
        </div>
      )}
      options={options} onSelect={onSelect}
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

export default MessageTypeDropDown;
