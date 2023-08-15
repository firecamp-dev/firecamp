//@ts-nocheck
import {default as Tab} from './Tab';
import { Braces, MoreHorizontal } from 'lucide-react';
import { VscDiff } from "@react-icons/all-files/vsc/VscDiff";

export default {
    title: "UI-Kit/Tab",
    component: Tab,
    argTypes: {
        className: ""
    }
};


const Template = (args) =>
    <Tab {...args} />;


export const TabListFinal = (args) =>
    <div className="bg-activityBar-background text-activityBar-foreground flex items-top">
        <div className="border-r border-input-border p-12">
            SideBar
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="flex border-b border-tab-border">
            <div className="flex flex-1 overflow-auto	pb-80	-mb-80">
                <Tab title="tab1" icon={<Braces title="Account" size={16}/>} state="default" />
                <Tab title="tab2" icon={<Braces title="Account" size={16}/>} state="modified" />
                <Tab title="tab3" icon={<Braces title="Account" size={16}/>} state="active" />
                <Tab title="tab3" icon={<Braces title="Account" size={16}/>} state="default" />
                <Tab title="tab3" icon={<Braces title="Account" size={16}/>} state="default" />
                <Tab title="tab3" icon={<Braces title="Account" size={16}/>} state="default" />
                <Tab title="tab3" icon={<Braces title="Account" size={16}/>} state="default" />
                <Tab title="sample tab" icon={<Braces title="Account" size={16}/>} state="default" />
                <Tab title="sample tab" icon={<Braces title="Account" size={16}/>} state="default" />
                <Tab title="sample tab" icon={<Braces title="Account" size={16}/>} state="default" />
                <Tab title="sample tab" icon={<Braces title="Account" size={16}/>} state="default" />
                <Tab title="sample tab" icon={<Braces title="Account" size={16}/>} state="default" ispreview={true} />
            </div>
                <div className="flex items-center">
                    <div className="flex items-center h-full px-1 mr-1 ">
                        <VscDiff size={16}  />
                    </div>
                    <div className="flex items-center h-full px-1  mr-1">
                        <MoreHorizontal size={16}  />
                    </div>
                </div>
            </div>
            <div className="p-12 bg-app-background">Tab Content</div>
        </div>
    </div>;
    