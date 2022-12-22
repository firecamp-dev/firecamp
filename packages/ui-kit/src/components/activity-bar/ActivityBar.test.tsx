import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import ActivityBar from './ActivityBar';
import { VscFiles } from "@react-icons/all-files/vsc/VscFiles";
import { VscHistory } from "@react-icons/all-files/vsc/VscHistory";
import { VscAccount } from "@react-icons/all-files/vsc/VscAccount";
import { VscSettingsGear } from "@react-icons/all-files/vsc/VscSettingsGear";

const compositeBarList = [
    { id: '1', icon: <VscFiles data-tip={'Explorer (⇧⌘P)'} data-for={'1'} />, text: 'Explorer (⇧⌘P)', active: false },
    { id: '2', icon: <VscAccount data-tip={'Environment (⇧⌘E)'} data-for={'2'} />, text: 'Environment (⇧⌘E)', active: true },
    { id: '3', icon: <VscHistory data-tip={'History (⇧⌘H)'} data-for={'3'} />, text: 'History (⇧⌘H)', active: false }
];

const actionBarList = [
    { id: '4', icon: <VscAccount data-tip={'User (⇧⌘U)'} data-for={'4'} />, text: 'User (⇧⌘U)', active: false },
    { id: '5', icon: <VscSettingsGear data-tip={'Settings (⇧⌘/)'} data-for={'5'} />, text: 'Settings (⇧⌘/)', active: false }
];

const Template = (args: any = {}) => {
    return <ActivityBar {...args.ActivityBar} >
        {
            (typeof args.CompositeBar !== "undefined" || typeof args.ActionBar !== "undefined") &&
            (<>
                {typeof args.CompositeBar !== "undefined" && (<ActivityBar.CompositeBar {...args.CompositeBar} items={compositeBarList} />)}
                {typeof args.ActionBar !== "undefined" && (<ActivityBar.ActionBar {...args.ActionBar}  items={actionBarList}/>)}
            </>)
        }
    </ActivityBar>
}

//Todo write test case for selection in CompositeBar and ActionBar component

describe("ActivityBar component", () => {

    test("should render the wrapper div with provided props", () => {
        let { container } = render(<Template
            ActivityBar={{
                id: 'activity-bar-container',
                className: 'activity-bar-classname',
                style: { 'maxWidth': '200px' },
            }}
            CompositeBar
            ActionBar
        />);
        let ActivityBarWrapper = container.firstElementChild;
        let CompositeBar = ActivityBarWrapper.firstElementChild;
        let ActionBar = ActivityBarWrapper.lastElementChild;

        //validate the wrapper component attributes
        expect(ActivityBarWrapper).toHaveClass('activity-bar-classname activitybar focus-outer2 w-12 bg-activityBarBackground text-activityBarForeground flex flex-col  border-r border-activityBarBorder');
        expect(ActivityBarWrapper.id).toBe("activity-bar-container");
        expect(ActivityBarWrapper).toHaveStyle({ 'max-width': '200px' })

        expect(ActivityBarWrapper.childElementCount).toBe(2);

        // validate CompositeBar props
        expect(CompositeBar).toHaveClass('composite-bar');
        expect(CompositeBar.childElementCount).toBe(compositeBarList.length);
        
        //validate ActionBar props
        expect(ActionBar).toHaveClass('action-bar mt-auto');
        expect(ActionBar.childElementCount).toBe(actionBarList.length);

    });

    test("should render with CompositeBar only", () => {
        let { container } = render(<Template
            ActivityBar={{
                id: 'activity-bar-container',
                className: 'activity-bar-classname',
                style: { 'maxWidth': '200px' },
            }}
            CompositeBar
        />);
        let ActivityBarWrapper = container.firstElementChild;
        let CompositeBar = ActivityBarWrapper.firstElementChild;

        //validate the wrapper component attributes
        expect(ActivityBarWrapper).toHaveClass('activity-bar-classname activitybar focus-outer2 w-12 bg-activityBarBackground text-activityBarForeground flex flex-col  border-r border-activityBarBorder');
        expect(ActivityBarWrapper.id).toBe("activity-bar-container");
        expect(ActivityBarWrapper).toHaveStyle({ 'max-width': '200px' })

        expect(ActivityBarWrapper.childElementCount).toBe(1);

        // validate CompositeBar props
        expect(CompositeBar).toHaveClass('composite-bar');
        expect(CompositeBar.childElementCount).toBe(compositeBarList.length);
        
  
    });

    test("should render with ActionBar only", () => {
        let { container } = render(<Template
            ActivityBar={{
                id: 'activity-bar-container',
                className: 'activity-bar-classname',
                style: { 'maxWidth': '200px' },
            }}
            ActionBar
        />);
        let ActivityBarWrapper = container.firstElementChild;
        let ActionBar = ActivityBarWrapper.lastElementChild;

        //validate the wrapper component attributes
        expect(ActivityBarWrapper).toHaveClass('activity-bar-classname activitybar focus-outer2 w-12 bg-activityBarBackground text-activityBarForeground flex flex-col  border-r border-activityBarBorder');
        expect(ActivityBarWrapper.id).toBe("activity-bar-container");
        expect(ActivityBarWrapper).toHaveStyle({ 'max-width': '200px' })

        expect(ActivityBarWrapper.childElementCount).toBe(1);

        //validate ActionBar props
        expect(ActionBar).toHaveClass('action-bar mt-auto');
        expect(ActionBar.childElementCount).toBe(actionBarList.length);

    });

});