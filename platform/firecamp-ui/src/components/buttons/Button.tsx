import { FC } from 'react';
import cx from 'classnames';
import { Button as MantineButton, createStyles } from '@mantine/core';
import { IButton } from './Button.interfaces';

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
  variant = EVariant.primary,

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
  animate = true,
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
  const customColor = danger ? 'red' : primary ? 'primaryColor' : 'dark';

  return (
    <MantineButton
      size={customSize}
      variant={customVariant}
      color={customColor}
      classNames={{
        ...classNames,
        root: cx(
          classNames.root,
          'flex font-normal',
          { 'active:transform-none': !animate },
          { 'hover:bg-transparent': transparent },

          // same color for both light/dark color variant
          {
            'text-secondaryColor-text bg-secondaryColor hover:bg-secondaryColor-hover':
              secondary,
          },

          {
            'text-primaryColor border-primaryColor hover:bg-primaryColor-hover hover:text-secondaryColor-text':
              customVariant === 'outline' && primary,
          },
          {
            'text-tab-foreground border-tab-border hover:bg-activityBar-border':
              customVariant === 'outline' && customColor === 'dark',
          },
          // custom disabled classes when button is disabled
          {
            'data-[disabled=true]:text-secondaryColor-text data-[disabled=true]:bg-primaryColor':
              props.disabled && customVariant === EVariant.primary && primary,
          },
          {
            'data-[disabled=true]:text-secondaryColor-text data-[disabled=true]:bg-secondaryColor':
              props.disabled && secondary,
          },
          {
            'data-[disabled=true]:text-secondaryColor-text data-[disabled=true]:bg-error':
              props.disabled && danger,
          },
          {
            'data-[disabled=true]:text-primaryColor data-[disabled=true]:bg-transparent':
              props.disabled &&
              (transparent || customVariant === EVariant.ghost) &&
              primary,
          },
          {
            'data-[disabled=true]:text-tab-foreground data-[disabled=true]:bg-transparent':
              props.disabled &&
              (transparent || customVariant === EVariant.ghost) &&
              !primary,
          },
          {
            'data-[disabled=true]:text-primaryColor data-[disabled=true]:border-primaryColor data-[disabled=true]:bg-transparent':
              props.disabled && customVariant === EVariant.outline && primary,
          },
          {
            'data-[disabled=true]:text-tab-foreground data-[disabled=true]:border-tab-border data-[disabled=true]:bg-transparent':
              props.disabled && customVariant === EVariant.outline && !primary,
          },
          {
            'justify-center': props.fullWidth && !props.leftIcon,
          },
          {
            'px-2.5': !text,
          }
        ),
        leftIcon: cx(classNames.leftIcon, {
          'mr-0': !text,
        }),
      }}
      {...props}
    >
      {text ?? children}
    </MantineButton>
  );
};
export default Button;
