import Help from './Help';
import { IHelp } from './interfaces/Help.interfaces';

export default {
    title: "UI-Kit/HelpAndSupport",
    component: Help,
    argTypes: {
    }
};

const Template = (args: IHelp) =><div className="bg-activityBarBackground h-96 w-full relative"> <Help {...args} /></div>;

export const HelpDemo = Template.bind({});
HelpDemo.args = {docLink: 'https://firecamp.io/'};