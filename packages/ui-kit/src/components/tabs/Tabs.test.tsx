import { useState, useEffect } from "react";
import "@testing-library/jest-dom";
import {render, screen} from "@testing-library/react";
import { VscJson } from "@react-icons/all-files/vsc/VscJson";

import Tabs from "./Tabs";
import { ITabs } from "./interfaces/Tabs.interfaces";
import { click, dragAndDrop } from "../../../__mocks__/eventMock";

const TAB_LIST = [
    {
        id: 'body',
        name: 'Body',
        icon: <VscJson />
    }, {
        id: 'auth',
        name: 'Auth'
    }, {
        id: 'header',
        name: 'Header'
    }
];

const TabArgs = {
    list: TAB_LIST,
    id: 'tabs-container',
    tabIndex: 2,
    className: "custom-classname",
    height: 33
};

const Template = (args: ITabs) => {
    const [activeTab, updateActiveTab] = useState('')

    return <Tabs {...args} activeTab={activeTab} onSelect={(id:string) => updateActiveTab(id) }/>;
}
describe("Tabs component : ", () => {

    test("tabs listing & each tab should render with proper styles", () => {

        render(<Tabs {...TabArgs}/>);

        const TabsContainer = screen.getByTestId('tabs-container');

        //Default class name
        expect(TabsContainer).toHaveClass('flex text-base !border-tabBorder !border-t-transparent');
        //Custom class name
        expect(TabsContainer).toHaveClass(TabArgs.className);

        expect(TabsContainer).toHaveAttribute('tabIndex', '2')
        expect(TabsContainer).toHaveAttribute('id', 'tabs-container')

        //tab default styles
        const TabListScroller = TabsContainer.firstElementChild.firstElementChild.firstElementChild;
        expect(TabListScroller).toHaveClass('flex border-b border-tabBorder items-start');
        expect(TabListScroller).toHaveStyle(`height: ${TabArgs.height}px`);

        expect(TabListScroller.childElementCount).toBe(TAB_LIST.length);

        // validate tab initial props
        const TabItem = TabListScroller.firstElementChild; 
        expect(TabItem.textContent).toBe(TAB_LIST[0].name);
        expect(TabItem).toHaveClass(`border-r border-l border-r-transparent border-l-transparent border-tabBorder border-b-tabBorder border-b relative cursor-pointer first:border-l-0 after:block text-tabForegroundInactive after:content-[''] after:absolute after:h-px after:w-0.5 after:-left-0.5 after:-bottom-px after:border-t after:border-tabBorder bg-transparent text-base`)

    });

    test("should update active tab based on click event", () => {
        render(<Template {...TabArgs}/>);

        const ActiveTab = screen.getByLabelText(TAB_LIST[0].name);
        
        expect(ActiveTab.getAttribute("aria-selected")).toBe("false");
        click(ActiveTab);

        expect(ActiveTab.getAttribute("aria-selected")).toBe("true");
        expect(ActiveTab.firstElementChild).toHaveClass("active");
    });

    test("should reorder the available tab", async () => {
        render(<Template {...TabArgs} canReorder={true}/>);

        const FirstTab = screen.getByLabelText(TAB_LIST[0].name);
        const LastTab = screen.getByLabelText(TAB_LIST[2].name);

        await dragAndDrop(FirstTab,LastTab);
        const TabListScroller = FirstTab.parentElement;
        
        screen.debug(TabListScroller)
        expect(TabListScroller.children[0].textContent).toBe(TAB_LIST[2].name);
        //Todo review the reorder functionality

    });

});