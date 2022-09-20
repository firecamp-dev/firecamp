//@ts-nocheck
import Button from './Button';
import { VscMenu } from "@react-icons/all-files/vsc/VscMenu";

export default {
  title: "UI-Kit/Button",
  component: Button,
  argTypes: {
    text: "Firecamp",
    color: { control: "select", options: ["primary", "secondary"] },
    size: { control: "select", options: ["sm", "md", 'lg'] },
    iconPosition: { control: "select", options: ["left", "right", 'icononly'] },
    transparent: false,
  }
};

const Template = (args) => <Button {...args} />;

export const ButtonDemo = Template.bind({});
ButtonDemo.args = {
  text: 'Sample Button', color: 'primary', size: 'md', icon: <VscMenu
    title="Account"
    size={16}
    className="z-20"
  />, iconPosition: 'left'
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = { text: 'Primary Button', color: 'primary', size: 'md' };

export const SecondaryButton = Template.bind({});
SecondaryButton.args = { text: 'Secondary Button', color: 'secondary', size: 'md' };

export const SmallButton = Template.bind({});
SmallButton.args = { text: 'Small Button', color: 'primary', size: 'sm' };

export const MediumButton = Template.bind({});
MediumButton.args = { text: 'Medium Button', color: 'primary', size: 'md' };

export const LargeButton = Template.bind({});
LargeButton.args = { text: 'Large Button', color: 'primary', size: 'lg' };

export const FullWidthButton = Template.bind({});
FullWidthButton.args = { text: 'FullWidth Button', color: 'primary', size: 'md', fullWidth: true };

export const TransparentButton = Template.bind({});
TransparentButton.args = { text: 'Transparent Button', color: 'primary', size: 'md', transparent: true };

export const GhostButton = Template.bind({});
GhostButton.args = { text: 'Transparent Button', color: 'primary', size: 'md', ghost: true };

export const ButtonWithIconLeft = Template.bind({});
ButtonWithIconLeft.args = {
  text: 'Sample Button', color: 'primary', size: 'md', icon: <VscMenu
    title="Account"
    size={16}
    className="z-20"
  />, iconPosition: 'left'
};

export const ButtonWithIconRight = Template.bind({});
ButtonWithIconRight.args = {
  text: 'Sample Button', color: 'primary', size: 'md', icon: <VscMenu
    title="Account"
    size={16}
    className="z-20"
  />, iconPosition: 'right'
};

export const ButtonIcon = Template.bind({});
ButtonIcon.args = {
  text: 'Sample Button...', color: 'primary', size: 'md', icon: <VscMenu
    title="Account"
    size={16}
    className="z-20"
  />, iconPosition: 'icononly'
};
