import cx from 'classnames';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import { Button, DropdownMenu } from '@firecamp/ui';

const MessageTypeDropDown = ({
  options,
  selectedOption,
  isOpen,
  onToggle,
  onSelect,
}) => {
  return (
    <DropdownMenu
      handler={() => (
        <div className="flex text-sm items-center flex-wrap">
          {' '}
          Message as
          <Button
            text={selectedOption.name || ''}
            classNames={{ root: 'ml-1' }}
            rightSection={
              <VscTriangleDown
                size={12}
                className={cx({ 'transform rotate-180': isOpen })}
              />
            }
            primary
            ghost
            size='compact-xs'
          />
        </div>
      )}
      options={options}
      onSelect={onSelect}
      onOpenChange={(v) => onToggle(v)}
      selected={selectedOption.name || ''}
      classNames={{
        dropdown: '-mt-1',
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
