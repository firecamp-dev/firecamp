import { FC } from 'react';
import { Button as MantineButton, createStyles } from '@mantine/core';
import { IButton } from './MButton.interfaces';

// custom styles for variants
const useStyles = createStyles((theme) => ({
  dangerVariant: {
    color: theme.white,
    backgroundColor: theme.colors.red[theme.colorScheme === 'light' ? 6 : 8],
    ':hover': {
      backgroundColor: theme.colors.red[theme.colorScheme === 'light' ? 7 : 9],
    },
  },
  dangerButton: {
    color: theme.white,
    backgroundColor: theme.colors.red[6],
  },
  ghostButton: {
    color: theme.colors[theme.primaryColor][6],
    backgroundColor: 'transparent',
  },
  primaryButton: {
    color: theme.white,
    backgroundColor: theme.colors[theme.primaryColor][6],
  },
  secondaryVariant: {
    backgroundColor: theme.colors.dark[6],
    color: theme.colors.dark[0],
    ':hover': {
      backgroundColor: theme.colors.dark[7],
    },
  },
  secondaryButton: {
    color: theme.colors.dark[0],
    backgroundColor: theme.colors.dark[6],
  },
  transparentButton: {
    color: theme.colors[theme.primaryColor][6],
    backgroundColor: 'transparent',
    borderColor: theme.colors[theme.primaryColor][6],
  },
}));

// props need to update wherever Button is used
// TODO: update withCaret prop usage by providing rightIcon={<VscTriangleDown size={12} />}
// TODO: update tooltip prop usage by providing title={tooltip}
// TODO: update iconLeft,iconRight,icon prop usage by providing leftIcon={<Icon/> & rightIcon={<Icon/>
// TODO: update all sizes props [xs, sm, md, lg] according to mantine props - adding compact prop for xs
// TODO: should keep primary prompt ??
enum EVariant {
  danger = 'danger', //custom variant
  primary = 'filled',
  ghost = 'subtle',
  secondary = 'white',
  transparent = 'outline',
}
enum ESize {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

const Button: FC<IButton> = ({
  children,
  classNames = {},
  size,
  variant,

  primary = false,
  ghost = false,
  secondary = false,
  danger = false,
  transparent = false,

  xs = false,
  sm = false,
  md = false,
  lg = false,

  text,
  uppercase = false,

  ...props
}) => {
  const { classes, cx } = useStyles();

  // default variant if not passed is primary
  const customVariant =
    (danger && EVariant.primary) ||
    (ghost && EVariant.ghost) ||
    (primary && EVariant.primary) ||
    (secondary && EVariant.secondary) ||
    (transparent && EVariant.transparent) ||
    variant;

  // default size if not passed is sm
  const customSize =
    (xs && ESize.xs) ||
    (sm && ESize.sm) ||
    (md && ESize.md) ||
    (lg && ESize.lg) ||
    size;

  return (
    <MantineButton
      size={customSize}
      compact={xs}
      variant={customVariant}
      classNames={{
        ...classNames,
        root: cx(
          classNames.root,
          { [classes.dangerVariant]: danger },
          { [classes.secondaryVariant]: customVariant === EVariant.secondary }
        ),
        label: cx(classNames.label, { uppercase: uppercase }),
      }}
      styles={{
        root: {
          '&:disabled, &[data-disabled]': cx(
            {
              [classes.dangerButton]: danger,
            },
            {
              [classes.ghostButton]: customVariant === EVariant.ghost,
            },
            {
              [classes.primaryButton]: customVariant === EVariant.primary,
            },
            {
              [classes.secondaryButton]: customVariant === EVariant.secondary,
            },
            {
              [classes.transparentButton]:
                customVariant === EVariant.transparent,
            }
          ),
        },
      }}
      {...props}
    >
      {text ?? children}
    </MantineButton>
  );
};
export default Button;
