//@ts-nocheck
import SplitView from './SplitView';

export default {
    title: "UI-Kit/SpitView",
    component: SplitView,
    argTypes: {
        text: "Firecamp",
    }
};

const Template = (args) => <div className="h-screen"><SplitView {...args} /></div>;

export const SplitViewDemo = Template.bind({});
SplitViewDemo.args = { text: 'Sample Button', color: 'primary', size: 'md', icon: 'sample', iconPosition: 'left' };
