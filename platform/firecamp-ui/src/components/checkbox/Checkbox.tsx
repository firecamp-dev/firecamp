import { FC } from 'react';
import { Checkbox, ICheckbox } from '@firecamp/ui';
import './Checkbox.scss';

/**
 * Checkbox in table formate (grid)
 */
const CheckboxInGrid: FC<ICheckbox> = ({
  id = '',
  onToggleCheck = (l, v) => {},
  checked = false,
  label = '',
  tabIndex = 0, //-1
  className = '',
  disabled = false,
  color = 'primary',
}) => {
  return (
    <div>
      <label htmlFor={`${id}`} className="checkbox-in-grid">
        {label}
      </label>
      <Checkbox
        key={`checkbox-in-grid-${id}`}
        id={id}
        onToggleCheck={onToggleCheck}
        checked={checked}
        tabIndex={tabIndex}
        classNames={{root: className}}
        disabled={disabled}
        color={color}
      />
    </div>
  );
};

export { CheckboxInGrid };
