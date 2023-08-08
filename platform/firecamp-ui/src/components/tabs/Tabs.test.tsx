import { useState, useEffect } from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Braces } from 'lucide-react';

import Tabs from "./Tabs";
import TabsV3 from "./v3/Tabs";
import { ITabs } from "./interfaces/Tabs.interfaces";
import { TId } from "@firecamp/types";
import { click, dragAndDrop } from "../../../__mocks__/eventMock";
import { ITab } from "./v3/Tab.interface";

const TAB_LIST = [
    {
        id: 'body',
        name: 'Body',
        icon: <Braces />
    }, {
        id: 'auth',
        name: 'Auth'
    }, {
        id: 'header',
        name: 'Header'
    }
];

const TAB_LIST_V3: Record<string,ITab> = {
    body: {
        id: 'body',
        name: 'Body'
    },
    auth: {
        id: 'auth',
        name: 'Auth'
    },
    header: {
        id: 'header',
        name: 'Header'
    }
};
const TAB_LIST_V3_ORDER: TId[] = ['body', 'auth', 'header'];

const TabArgs = {
    list: TAB_LIST,
    id: 'tabs-container',
    tabIndex: 2,
    className: "custom-classname",
    height: 33
};

const Template = (args: ITabs) => {
    const [activeTab, updateActiveTab] = useState('')

    return <Tabs {...args} activeTab={activeTab} onSelect={(id: string) => updateActiveTab(id)} />;
}
describe("Tabs component : ", () => {

    test("tabs listing & each tab should render with proper styles", () => {

        render(<Tabs {...TabArgs} />);

        const TabsContainer = screen.getByTestId('tabs-container');

        //Default class name
        expect(TabsContainer).toHaveClass('flex text-base !border-tab-border !border-t-transparent');
        //Custom class name
        expect(TabsContainer).toHaveClass(TabArgs.className);

        expect(TabsContainer).toHaveAttribute('tabIndex', '2')
        expect(TabsContainer).toHaveAttribute('id', 'tabs-container')

        //tab default styles
        const TabListScroller = screen.getByTestId('tabs-item-container');
        expect(TabListScroller).toHaveClass('flex border-b border-tab-border items-start');
        expect(TabListScroller).toHaveStyle(`height: ${TabArgs.height}px`);

        expect(TabListScroller.childElementCount).toBe(TAB_LIST.length);

        // validate tab initial props
        const TabItem = TabListScroller.firstElementChild;
        expect(TabItem.textContent).toBe(TAB_LIST[0].name);
        expect(TabItem).toHaveClass(`border-r border-l border-r-transparent border-l-transparent border-tab-border border-b-tab-border border-b relative cursor-pointer first:border-l-0 after:block text-tab-foreground-inactive after:content-[''] after:absolute after:h-px after:w-0.5 after:-left-0.5 after:-bottom-px after:border-t after:border-tab-border bg-transparent text-base`)

    });

    test("should update active tab based on click event", () => {
        render(<Template {...TabArgs} />);

        const ActiveTab = screen.getByLabelText(TAB_LIST[0].name);

        expect(ActiveTab.getAttribute("aria-selected")).toBe("false");
        click(ActiveTab);

        expect(ActiveTab.getAttribute("aria-selected")).toBe("true");
        expect(ActiveTab.firstElementChild).toHaveClass("active");
    });

    test("should render tabs with equal width", () => {
        render(<Template {...TabArgs} equalWidth={true} />);

        const AllTabs = screen.getAllByRole('tab');
        AllTabs.map(element => expect(element).toHaveClass('flex-1 text-center'));
    });

    test("should render component before the tab list scroller", () => {
        const { unmount } = render(<Template {...TabArgs} preComp={() => <div data-testid="pre-comp-tab">Initial Component</div>} />);
        let preComponentWrapper = screen.getByTestId('pre-comp-tab').parentElement;

        const TabsContainer = screen.getByTestId('tabs-container');
        expect(TabsContainer.childElementCount).toBe(2);

        expect(preComponentWrapper).toHaveClass('flex items-center pr-2 border-b border-tab-border border-r');
        expect(preComponentWrapper).toHaveClass('bg-tab-background');
        unmount();

        //should render component with tab-version-2
        render(<Template {...TabArgs} tabsVersion={2} preComp={() => <div data-testid="pre-comp-tab">Initial Component</div>} />);
        preComponentWrapper = screen.getByTestId('pre-comp-tab').parentElement;
        expect(preComponentWrapper).toHaveClass('bg-tab-background-activeColor');
    });

    test("should render component after the tab list scroller", () => {
        render(<Template {...TabArgs} postComp={() => <div data-testid="post-comp-tab">Initial Component</div>} />);
        const postComponentWrapper = screen.getByTestId('post-comp-tab').parentElement;

        const TabsContainer = screen.getByTestId('tabs-container');
        expect(TabsContainer.childElementCount).toBe(2);

        expect(postComponentWrapper).toHaveClass('flex items-center pr-2 border-b border-tab-border');
        expect(postComponentWrapper).toHaveClass('bg-transparent');

    });

    test("should render component suffix component after the tab list scroller", () => {
        render(<Template {...TabArgs}
            suffixComp={() => <div data-testid="suffix-comp-tab">Suffix Component</div>}
            postComp={() => <div data-testid="post-comp-tab">Initial Component</div>} />);
        const suffixComponentWrapper = screen.getByTestId('suffix-comp-tab').parentElement;

        const TabsContainer = screen.getByTestId('tabs-container');
        expect(TabsContainer.childElementCount).toBe(3);

        expect(suffixComponentWrapper).toHaveClass('flex-1 flex pl-1 items-center pr-2 border-b border-tab-border');
        expect(suffixComponentWrapper).toHaveClass('bg-transparent');

    });

    test("should render add tab icon", () => {
        let clicked = false;
        const { unmount } = render(<Template {...TabArgs}
            addTabIconMeta={{ id: 'add-tab-icon-id', show: true, onClick: () => clicked = true }}
        />);

        let addIconContainer = screen.getByTitle('IconAdd').parentElement.parentElement;
        expect(addIconContainer).toHaveClass('px-2 cursor-pointer h-8 flex items-center justify-center');
        expect(addIconContainer.getAttribute('id')).toBe('add-tab-icon-id');
        click(addIconContainer);
        expect(clicked).toBeTruthy();

        unmount();
        // validate click on disabled add icon
        clicked = false;
        render(<Template {...TabArgs}
            addTabIconMeta={{ id: 'add-tab-icon-id', show: true, disabled: true, onClick: () => clicked = true }}
        />);
        addIconContainer = screen.getByTitle('IconAdd').parentElement.parentElement;
        click(addIconContainer);
        expect(clicked).toBeFalsy();

    });

    test("should render close icon in tab", () => {
        let clicked = false;
        let { unmount } = render(<Template {...TabArgs}
            closeTabIconMeta={{ show: true, onClick: () => clicked = true }}
        />);

        let closeTabContainer = screen.getAllByTitle('IconClose');
        expect(closeTabContainer[0].parentElement.parentElement).toHaveClass('fc-tab-action-close flex items-center h-4 w-4 rounded-sm cursor-pointer hover:bg-focusColor');
        // screen.debug(closeTabContainer[0].parentElement.parentElement);

        const SecondTab = closeTabContainer[1];
        click(SecondTab);
        expect(clicked).toBeTruthy();

        unmount();
        // validate click on disabled add icon
        clicked = false;
        render(<Template {...TabArgs}
            closeTabIconMeta={{ show: true, disabled: true, onClick: () => clicked = true }}
        />);
        closeTabContainer = screen.getAllByTitle('IconClose');

        click(closeTabContainer[1]);
        expect(clicked).toBeFalsy();

    });

    test("Tabv3: should reorder the available tab", async () => {
        render(<TabsV3 list={TAB_LIST_V3} tabIndex={1} reOrderable={true} orders={TAB_LIST_V3_ORDER} />);

        const FirstTab = screen.getByLabelText(TAB_LIST_V3[TAB_LIST_V3_ORDER[0]].name);
        const LastTab = screen.getByLabelText(TAB_LIST_V3[TAB_LIST_V3_ORDER[2]].name);
        const FirstTabName = TAB_LIST_V3[TAB_LIST_V3_ORDER[0]].name;

        await dragAndDrop(FirstTab, LastTab);

        const TabListScroller = FirstTab.parentElement;
        expect(TabListScroller.lastElementChild.textContent).toBe(FirstTabName);

    });

});