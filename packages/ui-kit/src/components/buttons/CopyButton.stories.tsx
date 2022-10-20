//@ts-nocheck
import Button from './CopyButton';
import { VscMenu } from "@react-icons/all-files/vsc/VscMenu";

// Todo : Discuss Button props
// Unused props : id
// copy icon not visible (review)

export default {
  title: "UI-Kit/Button/variant",
  component: Button,
  argTypes: {
    className: {control: 'text' },
    text: {control: 'text'},
    showText: {control : 'boolean'},
    animation: {control : 'boolean'},
  }
};

const Template = (args) => <Button {...args} />;

export const CopyButtonWithTextPreview = Template.bind({});
CopyButtonWithTextPreview.args = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  showText: true,
  onCopy: (text) => console.log(`copied-text`, text)
};

export const CopyButtonWithoutTextPreview = Template.bind({});
CopyButtonWithoutTextPreview.args = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  showText: false,
  onCopy: (text) => console.log(`copied-text`, text)
};

export const CopyButtonWithoutAnimation = Template.bind({});
CopyButtonWithoutAnimation.args = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  showText: true,
  animation: false,
  onCopy: (text) => console.log(`copied-text-without-animation`, text)
};

export const CopyButtonWithCustomComponent = Template.bind({});
CopyButtonWithCustomComponent.args = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  children: [
    <div key="custom-component" className='h-2 p-3 border border-primaryColor text-primaryColor'>Custom component disables copy functionality</div>
  ]
};