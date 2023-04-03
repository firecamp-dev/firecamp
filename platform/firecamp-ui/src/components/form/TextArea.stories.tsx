//@ts-nocheck
import TextArea from './TextArea';

export default {
    title: "UI-Kit/FormElement",
    component: TextArea,
    argTypes: {
        label: "Firecamp"
    }
};

const Template = (args) => <div className="bg-activityBarActiveBackground p-4 w-96"><TextArea {...args} /></div>;

export const TextAreaDemo = Template.bind({});
TextAreaDemo.args = {name: 'textarea',label: 'textarea', className:'', placeholder: 'Sample Button', value: '',minHeight: '200px'};
