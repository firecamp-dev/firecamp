import { FC, ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';

import Button from './Button';
import { IButton } from './Button.interfaces';

export default {
  title: 'UI-Kit/Button',
  component: Button,
};

type btnType = IButton & { previewBtn?: ReactNode };
const Template: FC<btnType> = ({ previewBtn, ...args }) => (
  <>
    <div className="flex gap-2">
      <Button
        {...args}
        onClick={() => {
          console.log(`button clicked`);
        }}
      />{' '}
      {previewBtn}
    </div>
    <div></div>
  </>
);
const TemplateWithVariant = ({ variant }: { variant: btnType[] }) => (
  <div className="flex gap-2">
    <div className="flex flex-col gap-2">
      {variant.map((args, index) => (
        <div key={index}>
          <Button {...args} />
        </div>
      ))}
    </div>
  </div>
);

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  text: 'Primary Button',
  primary: true,
  sm: true,
};

export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
  text: 'Secondary Button',
  secondary: true,
  sm: true,
};

export const DangerButton = Template.bind({});
DangerButton.args = {
  text: 'Danger Button',
  danger: true,
  sm: true,
};

export const FullWidthButton = Template.bind({});
FullWidthButton.args = {
  text: 'FullWidth Button',
  primary: true,
  sm: true,
  fullWidth: true,
};

export const TransparentButton = Template.bind({});
TransparentButton.args = {
  text: 'Transparent Button',
  transparent: true,
};
export const OutlineButton = Template.bind({});
OutlineButton.args = {
  text: 'Transparent Button',
  outline: true,
  primary: true,
};

export const GhostButton = Template.bind({});
GhostButton.args = {
  text: 'Ghost Button',
  primary: true,
  sm: true,
  ghost: true,
};

export const ButtonIcon = Template.bind({});
ButtonIcon.args = {
  text: 'Sample Button...',
  primary: true,
  sm: true,
  leftSection: <Menu size={16} className="z-20" />,
};

export const CaretButton = Template.bind({});
CaretButton.args = {
  text: 'Button with caret icon',
  primary: true,
  sm: true,
  rightSection: <VscTriangleDown size={12} />,
};

export const ButtonWithToolTip = Template.bind({});
ButtonWithToolTip.args = {
  text: 'Button with tooltip',
  primary: true,
  sm: true,
  title: 'tooltiptext',
};

export const ButtonWithAdditionalDomProp = Template.bind({});
ButtonWithAdditionalDomProp.args = {
  text: 'Additional Button Prop',
  primary: true,
  sm: true,
  'test-id': 'testing-mantine-btn',
};

export const ButtonWithUpperCaseText = Template.bind({});
ButtonWithUpperCaseText.args = {
  text: 'Button with uppercase text',
  primary: true,
  sm: true,
  uppercase: true,
};

export const ButtonVariant = () => {
  return (
    <div className="flex gap-2">
      <TemplateWithVariant
        variant={[
          { text: 'Primary Button', primary: true, md: true },
          { text: 'Secondary Button', secondary: true, md: true },
          { text: 'Danger Button', danger: true, md: true },
          { text: 'Ghost Button', ghost: true, md: true },
          { text: 'Ghost Button', primary: true, ghost: true, md: true },
          { text: 'Transparent Button', transparent: true, md: true },
          {
            text: 'Transparent Button',
            primary: true,
            transparent: true,
            md: true,
          },
          { text: 'Outlined Button', outline: true, sm: true },
          { text: 'Outlined Button', outline: true, primary: true, sm: true },
        ]}
      />
      <TemplateWithVariant
        variant={[
          { text: 'Primary Button', primary: true, md: true, disabled: true },
          {
            text: 'Secondary Button',
            secondary: true,
            md: true,
            disabled: true,
          },
          { text: 'Danger Button', danger: true, md: true, disabled: true },
          { text: 'Ghost Button', ghost: true, md: true, disabled: true },
          {
            text: 'Ghost Button',
            primary: true,
            ghost: true,
            md: true,
            disabled: true,
          },
          {
            text: 'Transparent Button',
            transparent: true,
            md: true,
            disabled: true,
          },
          {
            text: 'Transparent Button',
            primary: true,
            transparent: true,
            md: true,
            disabled: true,
          },
          { text: 'Outlined Button', outline: true, sm: true, disabled: true },
          {
            text: 'Outlined Button',
            outline: true,
            primary: true,
            sm: true,
            disabled: true,
          },
        ]}
      />
    </div>
  );
};

export const ButtonSizes = () => {
  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        {[
          { text: 'xs', size: 'compact-xs', primary: true },
          { text: 'xs', xs: true, primary: true },
          { text: 'sm', sm: true, primary: true },
          { text: 'md', md: true, primary: true },
          { text: 'lg', lg: true, primary: true },
          { text: 'xl', size: 'xl', primary: true },
        ].map((args, index) => (
          <div key={index}>
            <Button {...args} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ButtonIconPosition = TemplateWithVariant.bind({});
ButtonIconPosition.args = {
  variant: [
    {
      text: 'Sample Button (with left icon)',
      primary: true,
      md: true,
      leftSection: <Menu size={16} className="z-20" />,
    },
    {
      text: 'Sample Button (with right icon)',
      primary: true,
      md: true,
      rightSection: <Menu size={16} className="z-20" />,
    },
  ],
};
