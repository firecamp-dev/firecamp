import Button from './Button';
import { VscMenu } from "@react-icons/all-files/vsc/VscMenu";
import { IButton } from './interfaces/Button.interfaces';

export default {
  title: "UI-Kit/Button/main",
  component: Button,
  argTypes: {
    id: {control: 'text' },
    className: {control: 'text' },
    text: {control: 'text'},
  
    transparent: {control : 'boolean'},
    ghost: {control : 'boolean'},
    primary: {control : 'boolean'},
    secondary: {control : 'boolean'},
    danger: {control : 'boolean'},

    xs: {control : 'boolean'},
    sm: {control : 'boolean'},
    md: {control : 'boolean'},
    lg: {control : 'boolean'},
    
    iconLeft: {control : 'boolean'},
    iconRight: {control : 'boolean'},

    fullWidth: {control : 'boolean'},
    uppercase: {control : 'boolean'},
    withCaret: {control : 'boolean'},
    tooltip: {control : 'text'},
    icon: {control : 'text' }
  }
};

const Template = (args: IButton) => <Button {...args} />;
const TemplateWithVariant = ({variant} : {variant: IButton[]}) => <div className='flex flex-col gap-2'>{variant.map((args,index) => <div key={index}><Button {...args} /></div>)}</div>

export const PrimaryButton = Template.bind({});
PrimaryButton.args = { text: 'Primary Button', primary: true, md: true };

export const SecondaryButton = Template.bind({});
SecondaryButton.args = { text: 'Secondary Button', secondary: true, md: true };

export const DangerButton = Template.bind({});
DangerButton.args = { text: 'Danger Button', danger: true, md: true };

export const FullWidthButton = Template.bind({});
FullWidthButton.args = { text: 'FullWidth Button', primary: true, md: true, fullWidth: true };

export const TransparentButton = Template.bind({});
TransparentButton.args = { text: 'Transparent Button', primary: true, md: true, transparent: true };

export const GhostButton = Template.bind({});
GhostButton.args = { text: 'Ghost Button', primary: true, md: true, ghost: true };

export const ButtonIcon = Template.bind({});
ButtonIcon.args = {
  text: 'Sample Button...', primary: true, md: true, icon: <VscMenu
    title="Account"
    size={16}
    className="z-20"
  />,
  iconLeft:true
};

export const CaretButton = Template.bind({});
CaretButton.args = { text: 'Button with caret icon', primary: true, md: true, withCaret: true };

export const ButtonWithToolTip = Template.bind({});
ButtonWithToolTip.args = { text: 'Button with tooltip', primary: true, md: true, tooltip: "tooltiptext" };

export const ButtonWithAdditionalDomProp = Template.bind({});
ButtonWithAdditionalDomProp.args = { text: 'Additional Button Prop', primary: true, md: true, "test-id": "testing" };

export const ButtonWithUpperCaseText = Template.bind({});
ButtonWithUpperCaseText.args = { text: 'Button with uppercase text', primary: true, md: true, uppercase: true };

export const ButtonVariant = TemplateWithVariant.bind({});
ButtonVariant.args = {
  variant: [
    { text: 'Primary Button', primary: true, md: true },
    { text: 'Secondary Button', secondary: true, md: true },
    { text: 'Danger Button', danger: true, md: true },
    { text: 'Ghost Button', ghost: true, md: true },
    { text: 'Transparent Button', transparent: true, md: true },
  ]
}

export const ButtonSizes = TemplateWithVariant.bind({});
ButtonSizes.args = {
  variant: [
    { text: 'Extra Small Button', primary: true, xs: true },
    { text: 'Small Button', primary: true, sm: true },
    { text: 'Medium Button', primary: true, md: true },
    { text: 'Large Button', primary: true, lg: true },
  ]
}

export const ButtonIconPosition = TemplateWithVariant.bind({});
ButtonIconPosition.args = {
  variant: [
    {
      text: 'Sample Button (with left icon)', 
      primary: true, 
      md: true, 
      icon: <VscMenu
        title="Account"
        size={16}
        className="z-20"
      />, 
      iconLeft: true
    },
    {
      text: 'Sample Button (with right icon)', 
      primary: true, 
      md: true, 
      icon: <VscMenu
        title="Account"
        size={16}
        className="z-20"
      />, 
      iconRight: true
    }
  ]
}
