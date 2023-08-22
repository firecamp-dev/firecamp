import { useState } from 'react';
import { Upload } from 'lucide-react';
import { FileInput, IFileInput } from '@firecamp/ui';

export default {
  title: 'UI-Kit/Input',
  component: FileInput,
};

const Template = (args: IFileInput) => {
  return (
    <FileInput
      onChange={(file: File) => console.log(`selected-file`, file)}
      {...args}
    />
  );
};

export const FileInputDemo = Template.bind({});
FileInputDemo.args = { placeholder: 'Select File' };

export const FileSelectedDemo = Template.bind({});
FileSelectedDemo.args = {
  placeholder: 'Select File',
  value: { name: 'filename' },
};
export const FileSelectedSecondary = Template.bind({});
FileSelectedSecondary.args = {
  placeholder: 'Select File',
  secondary: true,
  icon: <Upload size={16} />,
  iconWidth: 40,
  size: 'xs',
};

export const FileUploadExample = () => {
  const [file, updateFile] = useState(null);
  return (
    <FileInput
      onChange={(selectedFile: File) => {
        updateFile(selectedFile);
      }}
      accept="text/*"
      value={file}
      placeholder={'Select File'}
      {...(file
        ? {
            size: 'md',
          }
        : {
            secondary: true,
            icon: <Upload size={16} />,
            iconWidth: 40,
            size: 'xs',
          })}
    />
  );
};
