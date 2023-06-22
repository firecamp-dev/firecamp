import { FC } from 'react';
import cx from 'classnames';
import { VscCheck } from '@react-icons/all-files/vsc/VscCheck';
import { ICheckbox } from './interfaces/Checkbox.interfaces';
import './Checkbox.scss';

const Checkbox: FC<ICheckbox> = ({
  id = '',
  onToggleCheck = (l, v) => {},
  isChecked = false,
  label = '',
  tabIndex = 0,
  labelPlacing = 'right',
  className = '',
  disabled = false,
  note = '',
  color = 'primary',
  showLabel = true,
}) => {
  return (
    <div className={cx(className, 'flex')} tabIndex={tabIndex}>
      <label
        className={cx('fc-custom-checkbox !flex items-center mb-0 ', {
          'w-4': !showLabel,
        })}
        onClick={(e) => {
          if (e) {
            e.preventDefault();
          }
          if (!disabled) {
            onToggleCheck(label, !isChecked);
          }
        }}
        tabIndex={-1}
      >
        {showLabel && labelPlacing === 'left' ? (
          <span className="text-sm mr-2"> {label}</span>
        ) : (
          ''
        )}

        <div
          className={cx(
            'flex justify-center items-center cursor-pointer relative',
            color,
            {'opacity-50 cursor-default': disabled}
          )}
          tabIndex={-1}
        >
          <input
            type="checkbox"
            role="checkbox"
            className="hidden"
            checked={isChecked}
            readOnly={true}
            id={id}
          />
          <span className={cx("border w-4 h-4",{'border-primaryColor': isChecked},{'border-app-foreground': !isChecked})}></span>
          {isChecked ? (
            <VscCheck
              size={12}
              title={"IconCheck"}
              className="text-primaryColor absolute"
            />
          ) : (
            ''
          )}
        </div>
        {showLabel && labelPlacing === 'right' ? (
          <span className="text-sm ml-2 cursor-pointer"> {label}</span>
        ) : (
          ''
        )}
      </label>
      {!!note ? (
        <div className="fc-input-note">
          <span className="icv2-info-icon" />
          {note}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
export default Checkbox;

/**
 * Checkbox in table formate (grid)
 */
const CheckboxInGrid: FC<ICheckbox> = ({
  id = '',
  onToggleCheck = (l, v) => {},
  isChecked = false,
  label = '',
  tabIndex = 0, //-1
  className = '',
  disabled = false,
  note = '',
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
        isChecked={isChecked}
        tabIndex={tabIndex}
        className={className}
        disabled={disabled}
        note={note}
        color={color}
      />
    </div>
  );
};

export { CheckboxInGrid };
