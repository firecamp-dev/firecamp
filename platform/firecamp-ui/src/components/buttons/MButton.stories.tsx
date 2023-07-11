import { FC, ReactNode } from 'react';
import { VscMenu } from '@react-icons/all-files/vsc/VscMenu';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';

import MButton from './MButton';
import { IButton } from './MButton.interfaces';
import * as ButtonStories from './Button.stories';

export default {
  title: 'UI-Kit/MButton',
  component: MButton,
};

type btnType = IButton & { previewBtn?: ReactNode };
const Template: FC<btnType> = ({ previewBtn, ...args }) => (
  <>
    <div className="flex gap-2">
      <MButton {...args} /> {previewBtn}
    </div>
    <div></div>
  </>
);
const TemplateWithVariant = ({ variant }: { variant: btnType[] }) => (
  <div className="flex gap-2">
    <div className="flex flex-col gap-2">
      {variant.map((args, index) => (
        <div key={index}>
          <MButton {...args} />
        </div>
      ))}
    </div>
  </div>
);

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  text: 'Primary Button',
  md: true,
  previewBtn: (
    <ButtonStories.PrimaryButton {...ButtonStories.PrimaryButton.args} />
  ),
};

export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
  text: 'Secondary Button',
  secondary: true,
  md: true,
  previewBtn: (
    <ButtonStories.SecondaryButton {...ButtonStories.SecondaryButton.args} />
  ),
};

export const DangerButton = Template.bind({});
DangerButton.args = {
  text: 'Danger Button',
  danger: true,
  md: true,
  previewBtn: (
    <ButtonStories.DangerButton {...ButtonStories.DangerButton.args} />
  ),
};

export const FullWidthButton = Template.bind({});
FullWidthButton.args = {
  text: 'FullWidth Button',
  primary: true,
  md: true,
  fullWidth: true,
  previewBtn: (
    <ButtonStories.FullWidthButton {...ButtonStories.FullWidthButton.args} />
  ),
};

export const TransparentButton = Template.bind({});
TransparentButton.args = {
  text: 'Transparent Button',
  transparent: true,
  previewBtn: (
    <ButtonStories.TransparentButton
      {...ButtonStories.TransparentButton.args}
    />
  ),
};

export const GhostButton = Template.bind({});
GhostButton.args = {
  text: 'Ghost Button',
  primary: true,
  md: true,
  ghost: true,
  previewBtn: <ButtonStories.GhostButton {...ButtonStories.GhostButton.args} />,
};

export const ButtonIcon = Template.bind({});
ButtonIcon.args = {
  text: 'Sample Button...',
  primary: true,
  md: true,
  leftIcon: <VscMenu title="Account" size={16} className="z-20" />,
  previewBtn: <ButtonStories.ButtonIcon {...ButtonStories.ButtonIcon.args} />,
};

export const CaretButton = Template.bind({});
CaretButton.args = {
  text: 'Button with caret icon',
  primary: true,
  md: true,
  rightIcon: <VscTriangleDown size={12} />,
  previewBtn: <ButtonStories.CaretButton {...ButtonStories.CaretButton.args} />,
};

export const ButtonWithToolTip = Template.bind({});
ButtonWithToolTip.args = {
  text: 'Button with tooltip',
  primary: true,
  md: true,
  title: 'tooltiptext',
  previewBtn: (
    <ButtonStories.ButtonWithToolTip
      {...ButtonStories.ButtonWithToolTip.args}
    />
  ),
};

export const ButtonWithAdditionalDomProp = Template.bind({});
ButtonWithAdditionalDomProp.args = {
  text: 'Additional Button Prop',
  primary: true,
  md: true,
  'test-id': 'testing-mantine-btn',
  previewBtn: (
    <ButtonStories.ButtonWithAdditionalDomProp
      {...ButtonStories.ButtonWithAdditionalDomProp.args}
    />
  ),
};

export const ButtonWithUpperCaseText = Template.bind({});
ButtonWithUpperCaseText.args = {
  text: 'Button with uppercase text',
  primary: true,
  md: true,
  uppercase: true,
  previewBtn: (
    <ButtonStories.ButtonWithUpperCaseText
      {...ButtonStories.ButtonWithUpperCaseText.args}
    />
  ),
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
          { text: 'Transparent Button', transparent: true, md: true },
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
            text: 'Transparent Button',
            transparent: true,
            md: true,
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
          { text: 'xs', xs: true },
          { text: 'sm', sm: true },
          { text: 'md', md: true },
          { text: 'lg', lg: true },
          { text: 'xl', size: 'xl' },
        ].map((args, index) => (
          <div key={index}>
            <MButton {...args} />
          </div>
        ))}
      </div>
      <ButtonStories.ButtonSizes {...ButtonStories.ButtonSizes.args} />
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
      leftIcon: <VscMenu title="Account" size={16} className="z-20" />,
    },
    {
      text: 'Sample Button (with right icon)',
      primary: true,
      md: true,
      rightIcon: <VscMenu title="Account" size={16} className="z-20" />,
    },
  ],
};
