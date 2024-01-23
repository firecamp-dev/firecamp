import { FC } from 'react';
import cx from 'classnames';
import { Button as MantineButton } from '@mantine/core';
import { IButton } from './Button.interfaces';

enum EDefaultStyles {
  leftIcon = 'px-2.5',
  root = 'flex font-normal',
  preventButtonAnimation = 'active:transform-none',
  transparentButton = 'hover:bg-transparent',
  // same color for both light/dark color variant
  secondaryButton = 'text-secondaryColor-text bg-secondaryColor hover:bg-secondaryColor-hover',
  outlineVariantDefault = 'text-tab-foreground border-tab-border hover:bg-activityBar-border',
  outlineVariantPrimary = 'text-primaryColor border-primaryColor hover:bg-primaryColor-hover hover:text-secondaryColor-text',
  // custom classes when button is disabled
  disabledFilledVariantPrimary = 'data-[disabled=true]:text-secondaryColor-text data-[disabled=true]:bg-primaryColor',
  disabledFilledVariantSecondary = 'data-[disabled=true]:text-secondaryColor-text data-[disabled=true]:bg-secondaryColor',
  disabledFilledVariantDanger = 'data-[disabled=true]:text-secondaryColor-text data-[disabled=true]:bg-error',
  disabledSubtleVariantDefault = 'data-[disabled=true]:text-tab-foreground data-[disabled=true]:bg-transparent',
  disabledSubtleVariantPrimary = 'data-[disabled=true]:text-primaryColor data-[disabled=true]:bg-transparent',
  disabledOutlineVariantDefault = 'data-[disabled=true]:text-tab-foreground data-[disabled=true]:border-tab-border data-[disabled=true]:bg-transparent',
  disabledOutlineVariantPrimary = 'data-[disabled=true]:text-primaryColor data-[disabled=true]:border-primaryColor data-[disabled=true]:bg-transparent',
}

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
  const customColor = danger ? 'red' : primary ? 'primary-color' : 'dark';

  return (
    <MantineButton
      size={customSize}
      variant={customVariant}
      color={customColor}
      classNames={{
        ...classNames,
        root: cx(
          classNames.root,
          EDefaultStyles.root,
          { [EDefaultStyles.preventButtonAnimation]: !animate },
          { [EDefaultStyles.transparentButton]: transparent },
          {
            [EDefaultStyles.secondaryButton]: secondary,
          },
          {
            [EDefaultStyles.outlineVariantPrimary]:
              customVariant === EVariant.outline && primary,
          },
          {
            [EDefaultStyles.outlineVariantDefault]:
              customVariant === EVariant.outline && customColor === 'dark',
          },
          // custom disabled classes when button is disabled
          {
            [EDefaultStyles.disabledFilledVariantPrimary]:
              props.disabled && customVariant === EVariant.primary && primary,
          },
          {
            [EDefaultStyles.disabledFilledVariantSecondary]:
              props.disabled && secondary,
          },
          {
            [EDefaultStyles.disabledFilledVariantDanger]:
              props.disabled && danger,
          },
          {
            [EDefaultStyles.disabledSubtleVariantPrimary]:
              props.disabled &&
              (transparent || customVariant === EVariant.ghost) &&
              primary,
          },
          {
            [EDefaultStyles.disabledSubtleVariantDefault]:
              props.disabled &&
              (transparent || customVariant === EVariant.ghost) &&
              !primary,
          },
          {
            [EDefaultStyles.disabledOutlineVariantPrimary]:
              props.disabled && customVariant === EVariant.outline && primary,
          },
          {
            [EDefaultStyles.disabledOutlineVariantDefault]:
              props.disabled && customVariant === EVariant.outline && !primary,
          },
          {
            'justify-center': props.fullWidth && !props.leftSection,
          },
          {
            [EDefaultStyles.leftIcon]: !text,
          }
        ),
        section: cx(classNames.section, {
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
