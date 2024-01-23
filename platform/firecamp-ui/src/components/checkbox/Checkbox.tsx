import { FC } from 'react';
import cx from 'classnames';
import { Checkbox as MantineCheckbox, CheckboxProps } from '@mantine/core';

export interface ICheckbox extends CheckboxProps {
  /**
   * enabled by default & update color as primary color
   */
  primary?: boolean;
  /**
   * updated function for onChange handler
   * @param l : label value
   * @param v : status of checked
   * @returns
   */
  onToggleCheck?: (l: any, v: boolean) => void;
  /**
   * enabled by default, used for updating visibility of label
   */
  showLabel?: boolean;
}

const Checkbox: FC<ICheckbox> = ({
  color,
  label,
  classNames = {},
  primary = true,
  checked = false,
  disabled = false,
  onToggleCheck = (l, v) => {},
  showLabel = true,
  labelPosition,
  ...props
}) => {
  return (
    <MantineCheckbox
      size={'xs'}
      radius={'xs'}
      label={showLabel ? label : ''}
      disabled={disabled}
      checked={checked}
      labelPosition={labelPosition}
      classNames={{
        ...classNames,
        input: cx(
          'rounded-none	border-app-foreground !bg-transparent',
          {
            'checked:border-primaryColor focus:!border-primaryColor':
              checked && primary,
          },
          {
            'focus:!border-app-foreground checked:border-app-foreground': !(
              checked && primary
            ),
          },
          {
            'opacity-50 !border-inherit': disabled,
          },
          { 'checked:border-primaryColor': disabled && primary },
          { 'checked:border-inherit	': disabled && !primary },
          classNames.input
        ),
        icon: cx(
          { '!text-primaryColor': primary },
          { '!text-app-foreground': !primary },
          classNames.icon,
          { 'opacity-50 !border-inherit': disabled && checked }
        ),
        label: cx(
          '!text-app-foreground',
          { 'pr-2': labelPosition === 'left' },
          { 'pl-2': labelPosition === 'left' },
          classNames.label
        ),
      }}
      onChange={(e) => onToggleCheck(label, e.target.checked)}
      data-testid="checkbox"
      {...props}
    />
  );
};
export default Checkbox;
