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
  text: 'Sample Button',
  primary:true, md: true,
  icon: <VscMenu title="Account" size={16} className="z-20"/>, 
  iconLeft: true
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = { text: 'Primary Button', primary: true, md: true };

export const SecondaryButton = Template.bind({});
SecondaryButton.args = { text: 'Secondary Button', secondary: true, md: true };

export const SmallButton = Template.bind({});
SmallButton.args = { text: 'Small Button', primary: true, size: 'sm' };

export const MediumButton = Template.bind({});
MediumButton.args = { text: 'Medium Button', primary: true, md: true };

export const LargeButton = Template.bind({});
LargeButton.args = { text: 'Large Button', primary: true, size: 'lg' };

export const FullWidthButton = Template.bind({});
FullWidthButton.args = { text: 'FullWidth Button', primary: true, md: true, fullWidth: true };

export const TransparentButton = Template.bind({});
TransparentButton.args = { text: 'Transparent Button', primary: true, md: true, transparent: true };

export const GhostButton = Template.bind({});
GhostButton.args = { text: 'Transparent Button', primary: true, md: true, ghost: true };

export const ButtonWithIconLeft = Template.bind({});
ButtonWithIconLeft.args = {
  text: 'Sample Button', primary: true, md: true, icon: <VscMenu
    title="Account"
    size={16}
    className="z-20"
  />, 
  iconLeft: true
};

export const ButtonWithIconRight = Template.bind({});
ButtonWithIconRight.args = {
  text: 'Sample Button', primary: true, md: true, icon: <VscMenu
    title="Account"
    size={16}
    className="z-20"
  />, 
  iconRight: true
};

export const ButtonIcon = Template.bind({});
ButtonIcon.args = {
  text: 'Sample Button...', primary: true, md: true, icon: <VscMenu
    title="Account"
    size={16}
    className="z-20"
  />, 
  iconLeft: true
};
