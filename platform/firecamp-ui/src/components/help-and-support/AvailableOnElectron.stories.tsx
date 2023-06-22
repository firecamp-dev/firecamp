//@ts-nocheck
import AvailableOnElectron from './AvailableOnElectron';

export default {
    title: "UI-Kit/HelpAndSupport",
    component: AvailableOnElectron,
    argTypes: {
    }
};

const Template = (args) =><div className="bg-activityBar-background h-96 w-full relative"> <AvailableOnElectron {...args} /></div>;

export const AvailableOnElectronDemo = Template.bind({});
AvailableOnElectronDemo.args = {name: 'Sample UI', link: '#' , linkText:"desktop app"};