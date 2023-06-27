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

export default MessageTypeDropDown;
