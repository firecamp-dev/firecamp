import cx from 'classnames';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import { Button, DropdownMenu } from '@firecamp/ui';

{
  /* TODO: check preview */
}
const TypedArrayViewDropDown = ({
  options,
  selectedOption,
  isOpen,
  onToggle,
  onSelect,
}) => {
  return (
    <DropdownMenu
      handler={() => (
        <Button
          text={selectedOption.name}
          rightSection={
            <VscTriangleDown
              size={12}
              className={cx({ 'transform rotate-180': isOpen })}
            />
          }
          size='compact-xs'
          primary
          ghost
        />
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

export default TypedArrayViewDropDown;
