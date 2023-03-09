//@ts-nocheck
import SwitchButton from './SwitchButton';

export default {
    title: "UI-Kit/FormGroup",
    component: SwitchButton,
    argTypes: {
        label: "Firecamp"
    }
};

const Template = (args) => <div className="bg-activityBarActiveBackground p-4 w-96"><SwitchButton {...args} /></div>;

export const SwitchButtonDemo = Template.bind({});
