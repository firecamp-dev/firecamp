import TextArea, { ITextArea } from './TextArea';

export default {
  title: 'UI-Kit/FormElement',
  component: TextArea,
  argTypes: {
    label: 'Firecamp',
  },
};

const Template = (args: ITextArea) => (
  <div className="bg-activityBar-background-active p-4 w-96">
    <TextArea {...args} />
  </div>
);

export const TextAreaDemo = Template.bind({});
TextAreaDemo.args = {
  name: 'textarea',
  label: 'Textarea Label',
  placeholder: 'Sample Button',
  defaultValue: 'Sample Button',
  rows: 10,
};
