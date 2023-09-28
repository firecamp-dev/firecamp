import { FC } from 'react';
import cx from 'classnames';
import {
  Switch as MantineSwitch,
  SwitchProps,
  createStyles,
  rem,
} from '@mantine/core';

export interface ISwitch extends SwitchProps {
  /**
   * variant with extra small size
   */
  xxs?: boolean;
  onToggleCheck: (v: boolean) => void;
}
const useStyles = createStyles((theme, { xxs }: Partial<ISwitch>) => ({
  track: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[4]
        : theme.colors.dark[5],
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[4]
        : theme.colors.dark[5],
    'input:checked + &': {
      backgroundColor:
        theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 8 : 6],
      borderColor:
        theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 8 : 6],
    },
    ...(xxs
      ? {
          minWidth: rem(20),
          height: rem(10),
        }
      : {}),
  },
  labelWrapper: {
    ...(xxs
      ? {
          fontSize: rem(10),
          lineHeight: rem(10),
        }
      : {}),
  },
  thumb: {
    borderColor: `${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]
    } !important`,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[7]
        : theme.colors.gray[0],

    ...(xxs
      ? {
          height: rem(6),
          width: rem(6),
          'input:checked + * > &': {
            left: `calc(100% - ${rem(7)})`,
            borderColor: theme.white,
          },
        }
      : {}),
  },
  trackLabel: {
    ...(xxs
      ? {
          minWidth: `calc(${rem(20 - 6)})`,
          paddingInline: rem(3),
          margin: `0 0 0 calc(${rem(7)})`,

          'input:checked + * > &': {
            margin: `0 calc(${rem(7)}) 0 0`,
          },
        }
      : {}),
  },
}));

const Switch: FC<ISwitch> = ({
  xxs = false,
  classNames = {},
  onToggleCheck,
  ...props
}) => {
  const { classes } = useStyles({ xxs });
  return (
    <MantineSwitch
      radius={'lg'}
      onChange={(e) => onToggleCheck(e.target.checked)}
      classNames={{
        ...classNames,
        labelWrapper: cx(classes.labelWrapper, classNames.labelWrapper),
        thumb: cx(classes.thumb, classNames.thumb),
        track: cx('shadow-md', classes.track, classNames.track),
        trackLabel: cx(classes.trackLabel, classNames.trackLabel),
      }}
      data-testid="switch"
      {...props}
    />
  );
};

export default Switch;
