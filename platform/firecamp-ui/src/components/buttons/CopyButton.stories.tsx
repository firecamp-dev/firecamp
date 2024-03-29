import Button from './CopyButton';
import { ICopyButton } from "./CopyButton.interfaces"

export default {
  title: "UI-Kit/CopyButton",
  component: Button,
  argTypes: {
    className: {control: 'text' },
    text: {control: 'text'},
    showText: {control : 'boolean'},
    animation: {control : 'boolean'},
  }
};

const Template = (args: ICopyButton) => <Button {...args} />;

export const CopyButtonWithText = Template.bind({});
CopyButtonWithText.args = { 
  className: 'border px-3',
  text: 'Copy Button Text' ,
  showText: true,
  onCopy: (text : string) => console.log(`copied-text`, text)
};

export const CopyButtonWithoutText = Template.bind({});
CopyButtonWithoutText.args = { 
  className: 'border px-3 bg-app-background-secondary',
  text: 'Copy Button Text' ,
  showText: false,
  showCopied: true,
  onCopy: (text : string) => console.log(`copied-text`, text)
};

export const CopyButtonWithoutAnimation = Template.bind({});
CopyButtonWithoutAnimation.args = { 
  className: 'border px-3',
  text: 'Copy Button Text' ,
  showText: true,
  animation: false,
  onCopy: (text : string) => console.log(`copied-text-without-animation`, text)
};