import { default as Tab } from './Tab';
import { ITab } from './interfaces/Tab.interface';
import { VscJson } from "@react-icons/all-files/vsc/VscJson";

export default {
    title: "UI-Kit/Tab",
    component: Tab,
    argTypes: {
        className: ""
    }
};

const Template = (args: ITab) =>
    <div className="bg-activityBarBackground text-activityBarForeground flex items-top h-32">
        <div className="border-r !border-inputBorder p-12">
            SideBar
        </div>
        <div className="flex-1">
            <div className="flex border-b !border-tabBorder">
                <Tab {...args} />
            </div>
            <div className="p-12">Tab Content</div>
        </div>
    </div>;

export const TabDefault = Template.bind({});
TabDefault.args = {
    title: 'Sample Tab',
    postComp: () => <VscJson title="Account" size={16} />,
    state: 'default'
};

export const TabActiveBottomBorder = Template.bind({});
TabActiveBottomBorder.args = {
    title: 'Sample Tab',
    preComp: () => <VscJson title="Account" size={16} />,
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
    preComp: () => <VscJson title="Account" size={16} />,
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
    preComp: () => <VscJson title="Account" size={16} />,
    state: 'default',
    borderMeta: {
        placementForActive: 'top',
        right: false
    },
    isActive: true
};

export const TabPreview = Template.bind({});
TabPreview.args = { title: 'Sample Tab', preComp: () => <VscJson title="Account" size={16} />, state: 'default', ispreview: true };

export const TabModified = Template.bind({});
TabModified.args = { title: 'Sample Tab', preComp: () => <VscJson title="Account" size={16} />, state: 'modified' };