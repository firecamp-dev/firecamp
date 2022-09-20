//@ts-nocheck
import FileInput from './FileInput';

export default {
    title: "UI-Kit/Input",
    component: FileInput,
    argTypes: {
        placeholder: "Firecamp",
        value: "Firecamp value"
    }
};

const Template = (args) =><div className="bg-activityBarBackground p-4 w-96"> <FileInput {...args} /></div>;

export const FileInputDemo = Template.bind({});
FileInputDemo.args = {placeholder: 'Sample Button', value: ''};

