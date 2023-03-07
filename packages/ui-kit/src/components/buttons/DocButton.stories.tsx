import Button from './DocButton';
import { IDocButton } from "./interfaces/DocButton.interfaces"

export default {
  title: "UI-Kit/Button/variant2",
  component: Button,
  argTypes: {
    text: {control: 'text' },
    link: {control: 'text' },
    target: {control: 'text' },
    className: {control: 'text' },
    showIcon: {control : 'boolean'},
    iconClassName: {control : 'text'},
    style: {control : 'object'},
  }
};

const Template = (args: IDocButton) => <Button {...args} />;

export const DocButton = Template.bind({});
DocButton.args = { 
  text: 'Help'
};

export const CustomDocButton = Template.bind({});
CustomDocButton.args = { 
  text: 'Custom Help Text',
  link: 'https://firecamp.io/',
  className: 'p-3',
  showIcon: false,
  iconClassName: 'icon-info-24px-1 font-base',
  style: {
    background: "coral"
  }
};
