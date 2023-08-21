import { FileInput, IFileInput } from '@firecamp/ui';

export default {
  title: 'UI-Kit/Input',
  component: FileInput,
};

const Template = (args: IFileInput) => <FileInput {...args} />;

export const FileInputDemo = Template.bind({});
FileInputDemo.args = { placeholder: 'Select File' };

export const FileSelectedDemo = Template.bind({});
FileSelectedDemo.args = {
  placeholder: 'Select File',
  value: { name: 'filename' },
};
