import Button from './CopyButton';
import { ICopyButton } from "./interfaces/CopyButton.interfaces"

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
  className: 'border p-3',
  text: 'Copy Button Text' ,
  showText: true,
  onCopy: (text : string) => console.log(`copied-text`, text)
};

export const CopyButtonWithoutText = Template.bind({});
CopyButtonWithoutText.args = { 
  className: 'border p-3 bg-appBackground2',
  text: 'Copy Button Text' ,
  showText: false,
  showCopied: true,
  onCopy: (text : string) => console.log(`copied-text`, text)
};

export const CopyButtonWithoutAnimation = Template.bind({});
CopyButtonWithoutAnimation.args = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  showText: true,
  animation: false,
  onCopy: (text : string) => console.log(`copied-text-without-animation`, text)
};

export const CopyButtonWithCustomComponent = Template.bind({});
CopyButtonWithCustomComponent.args = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  children: [
    <div key="custom-component" className='h-12 p-3 border border-primaryColor text-primaryColor'>
      Custom component disables copy functionality
      </div>
  ]
};