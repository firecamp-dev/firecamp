import { FC } from 'react';
import {
  Checkbox as MantineCheckbox,
  CheckboxProps,
  createStyles,
} from '@mantine/core';

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

const useStyles = createStyles((theme, { primary }: Partial<ICheckbox>) => ({
  disabled: {
    opacity: '50% !important',
    '&:checked': {
      borderColor: primary
        ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 8 : 6]
        : 'initial',
    },
    borderColor: 'initial',
  },
  input: {
    borderRadius: '0px',
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[4]
        : theme.colors.dark[5],
    backgroundColor: 'transparent !important',
  },
  icon: {
    ...(primary
      ? {
          color: `${
            theme.colors[theme.primaryColor][
              theme.colorScheme === 'dark' ? 8 : 6
            ]
          } !important`,
        }
      : {
          color: `${
            theme.colorScheme === 'dark'
              ? theme.colors.gray[4]
              : theme.colors.dark[5]
          } !important`,
        }),
  },
  label: {
    color: `${
      theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.dark[5]
    }  !important`,
  },
}));

const Checkbox: FC<ICheckbox> = ({
  color,
  label,
  classNames = {},
  primary = true,
  checked = false,
  disabled = false,
  onToggleCheck = (l, v) => {},
  showLabel = true,
  ...props
}) => {
  const { classes, cx, theme } = useStyles({ primary: primary });
  const customColor = primary
    ? 'primaryColor'
    : theme.colorScheme === 'dark'
    ? 'gray'
    : 'dark';

  return (
    <MantineCheckbox
      color={customColor}
      size={'xs'}
      radius={'xs'}
      label={showLabel ? label : ''}
      disabled={disabled}
      checked={checked}
      classNames={{
        ...classNames,
        input: cx(classes.input, classNames.input, {
          [classes.disabled]: disabled,
        }),
        icon: cx(classes.icon, classNames.icon, {
          [classes.disabled]: disabled && checked,
        }),
        label: cx(classes.label, classNames.label),
      }}
      onChange={(e) => onToggleCheck(label, e.target.checked)}
      {...props}
    />
  );
};
export default Checkbox;
