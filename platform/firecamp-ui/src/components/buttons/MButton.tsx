import { FC } from 'react';
import { Button as MantineButton, createStyles } from '@mantine/core';
import { IButton } from './MButton.interfaces';

// custom styles for variants
const useStyles = createStyles((theme, { variant, color }: IButton) => ({
  root: {
    display: 'flex',
    ...(variant === 'outline'
      ? {
          color:
            color === 'primaryColor'
              ? theme.colors[theme.primaryColor][
                  theme.colorScheme === 'light' ? 6 : 8
                ]
              : theme.colors[color][theme.colorScheme === 'light' ? 6 : 0],
          borderColor:
            color === 'primaryColor'
              ? theme.colors[theme.primaryColor][
                  theme.colorScheme === 'light' ? 6 : 8
                ]
              : theme.colors[color][theme.colorScheme === 'light' ? 6 : 0],
        }
      : {}),
    // same color for both light/dark color variant
    ...(variant === 'filled' && color === 'dark'
      ? {
          color: theme.white,
          backgroundColor: theme.colors.dark[4],
          ':hover': {
            backgroundColor: theme.colors.dark[5],
          },
        }
      : {}),
    '&:disabled, &[data-disabled]': {
      color:
        variant === 'filled'
          ? theme.white
          : color === 'primaryColor'
          ? theme.colors[theme.primaryColor][
              theme.colorScheme === 'light' ? 6 : 8
            ]
          : theme.colors[color][theme.colorScheme === 'light' ? 6 : 8],
      backgroundColor:
        variant === 'filled'
          ? color === 'primaryColor'
            ? theme.colors[theme.primaryColor][
                theme.colorScheme === 'light' ? 6 : 8
              ]
            : theme.colors[color][theme.colorScheme === 'light' ? 6 : 8]
          : 'transparent',
      ...(variant === 'outline'
        ? {
            color:
              color === 'primaryColor'
                ? theme.colors[theme.primaryColor][
                    theme.colorScheme === 'light' ? 6 : 8
                  ]
                : theme.colors[color][theme.colorScheme === 'light' ? 6 : 0],
            borderColor:
              color === 'primaryColor'
                ? theme.colors[theme.primaryColor][
                    theme.colorScheme === 'light' ? 6 : 8
                  ]
                : theme.colors[color][theme.colorScheme === 'light' ? 6 : 0],
          }
        : {}),
      ...(variant === 'filled' && color === 'dark'
        ? {
            color: theme.white,
            backgroundColor: theme.colors.dark[4],
          }
        : {}),
    },
  },
  transparent: {
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
}));

// props need to update wherever Button is used
// TODO: update withCaret prop usage by providing rightIcon={<VscTriangleDown size={12} />}
// TODO: update tooltip prop usage by providing title={tooltip}
// TODO: update iconLeft,iconRight,icon prop usage by providing leftIcon={<Icon/> & rightIcon={<Icon/>
// TODO: update all sizes props [xs, sm, md, lg] according to mantine props - adding compact prop for xs
// TODO: discuss should keep primary prompt ?? currently used with outline prop
enum EVariant {
  primary = 'filled',
  ghost = 'subtle',
  outline = 'outline',
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
  outline = false,

  xs = false,
  sm = false,
  md = false,
  lg = false,

  text,
  ...props
}) => {
  // default variant if not passed is primary
  const customVariant =
    ((danger || secondary) && EVariant.primary) ||
    ((ghost || transparent) && EVariant.ghost) ||
    (outline && EVariant.outline) ||
    variant;

  // default size if not passed is sm
  const customSize =
    (xs && ESize.xs) ||
    (sm && ESize.sm) ||
    (md && ESize.md) ||
    (lg && ESize.lg) ||
    size;

  // default size if not passed is sm
  const customColor = danger
    ? 'red'
    : secondary || (outline && !primary)
    ? 'dark'
    : 'primaryColor';
  const { classes, cx } = useStyles({
    variant: customVariant ?? 'filled',
    color: customColor,
  });

  return (
    <MantineButton
      size={customSize}
      variant={customVariant}
      color={customColor}
      classNames={{
        ...classNames,
        root: cx(
          classNames.root,
          classes.root,
          { [classes.transparent]: transparent },
          { 'justify-center': props.fullWidth }
        ),
      }}
      {...props}
    >
      {text ?? children}
    </MantineButton>
  );
};
export default Button;

// possible variants
// root: '!text-info',
// root: 'hover:!bg-focusColor !text-app-foreground-inactive'
// className="hover:!bg-focus2 ml-1 !text-app-foreground-inactive !py-0"
