//@ts-nocheck
import Help from './Help';

export default {
    title: "UI-Kit/HelpAndSupport",
    component: Help,
    argTypes: {
    }
};

const Template = (args) =><div className="bg-activityBarBackground h-96 w-full relative"> <Help {...args} /></div>;

export const HelpDemo = Template.bind({});
HelpDemo.args = {name: 'Sample UI', link: '#' , linkText:"desktop app"};