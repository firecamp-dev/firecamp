import { default as Tab } from './Tab';
import { ITab } from './interfaces/Tab.interface';
import { Braces } from 'lucide-react';
import { IoNotificationsOutline } from '@react-icons/all-files/io5/IoNotificationsOutline';
export default {
    title: "UI-Kit/Tab",
    component: Tab,
    argTypes: {
        className: ""
    }
};

const Template = (args: ITab) =>
    <div className="bg-activityBar-background text-activityBar-foreground flex items-top h-32">
        <div className="border-r !border-input-border p-12">
            SideBar
        </div>
        <div className="flex-1">
            <div className="flex border-b !border-tab-border">
                <Tab {...args} />
            </div>
            <div className="p-12">Tab Content</div>
        </div>
    </div>;

export const TabDefault = Template.bind({});
TabDefault.args = {
    title: 'Sample Tab',
    postComp: () => <Braces title="Account" size={16} />,
    state: 'default'
};

export const TabActiveBottomBorder = Template.bind({});
TabActiveBottomBorder.args = {
    title: 'Sample Tab',
    preComp: () => <Braces title="Account" size={16} />,
    state: 'default',
    borderMeta: {
        placementForActive: 'bottom',
        right: true
    },
    isActive: true
};

export const TabActiveTopBorder = Template.bind({});
TabActiveTopBorder.args = {
    title: 'Sample Tab',
    preComp: () => <Braces title="Account" size={16} />,
    state: 'default',
    borderMeta: {
        placementForActive: 'top',
        right: true
    },
    isActive: true
};

export const TabActiveWORightborder = Template.bind({});
TabActiveWORightborder.args = {
    title: 'Sample Tab',
    preComp: () => <Braces title="Account" size={16} />,
    state: 'default',
    borderMeta: {
        placementForActive: 'top',
        right: false
    },
    isActive: true
};

export const TabPreview = Template.bind({});
TabPreview.args = { title: 'Sample Tab', preComp: () => <Braces size={16} />, state: 'default', ispreview: true };

export const TabModified = Template.bind({});
TabModified.args = { title: 'Sample Tab', preComp: () => <Braces size={16} />, state: 'modified' };

export const TabWithIcon = Template.bind({});
TabWithIcon.args = { id: 'body',
name: 'Sample Tab', preComp: () => <IoNotificationsOutline/> };