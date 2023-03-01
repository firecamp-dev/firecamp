//@ts-nocheck
import { VscJson } from "@react-icons/all-files/vsc/VscJson";

import { default as Tabs } from './Tabs';
import { default as Button } from '../buttons/Button';
import { MenuBarDemo } from '../activity-bar/MenuBar.stories';

const demoArgs = [
    {
        id: 'body',
        title: 'Body',
        icon: <VscJson />
    }, {
        id: 'auth',
        title: 'Auth'
    }, {
        id: 'header',
        title: 'Header'
    }
]

export default {
    title: "UI-Kit/Tabs",
    component: Tabs,
    argTypes: {
        className: ""
    }
};

const Template = (args) =>
    <div className="bg-activityBarBackground text-activityBarForeground flex items-top h-screen">
        <div className="border-r border-inputBorder p-12">
            SideBar
        </div>
        <div className="flex-1">
            <Tabs {...args} />
            <div className="p-12">Tab Content</div>
        </div>
    </div>;

export const TabsDemo = Template.bind({});
TabsDemo.args = {
    list: demoArgs,
    activeTab: 'auth',
    borderMeta: {
        placementForActive: 'top'
    }
};

export const TabsDemoLeftComp = Template.bind({});
TabsDemoLeftComp.args = {
    list: demoArgs,
    leftComp: () => <Button text="Sample Button" color="primary" />
};

export const TabsDemoRightComp = Template.bind({});
TabsDemoRightComp.args = {
    tabslist: demoArgs,
    rightComp: () => <MenuBarDemo />
};