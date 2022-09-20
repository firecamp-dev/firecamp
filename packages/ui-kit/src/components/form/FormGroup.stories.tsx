//@ts-nocheck
import Input from '../input/Input';
import FormGroup from './FormGroup';

export default {
    title: "UI-Kit/FormGroup",
    component: FormGroup,
    argTypes: {
        label: "Firecamp"
    }
};

const Template = (args) => <div className="bg-activityBarActiveBackground p-4 w-96"><FormGroup {...args} /></div>;

export const FromGroupDemo = Template.bind({});
FromGroupDemo.args = {
    label: 'Label',
    children: [<Input placeholder="Sample Input" />]
};

export const FromGroupCheckBoxDemo = Template.bind({});
FromGroupCheckBoxDemo.args = {
    label: 'Label',
    children: [<Input placeholder="Sample Input" />]
};