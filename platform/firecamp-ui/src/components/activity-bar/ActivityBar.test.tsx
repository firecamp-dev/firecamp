import {useState} from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Files, History, Settings, UserCircle2 } from 'lucide-react';

import ActivityBar from './ActivityBar';
import { click } from '../../../__mocks__/eventMock';

const compositeBarList = [
    { id: '1', icon: <Files data-tip={'Explorer (⇧⌘P)'} data-for={'1'} />, text: 'Explorer (⇧⌘P)', active: false },
    { id: '2', icon: <UserCircle2 data-tip={'Environment (⇧⌘E)'} data-for={'2'} />, text: 'Environment (⇧⌘E)', active: true },
    { id: '3', icon: <History data-tip={'History (⇧⌘H)'} data-for={'3'} />, text: 'History (⇧⌘H)', active: false }
];

const actionBarList = [
    { id: '4', icon: <UserCircle2 data-tip={'User (⇧⌘U)'} data-for={'4'} />, text: 'User (⇧⌘U)', active: false },
    { id: '5', icon: <Settings data-tip={'Settings (⇧⌘/)'} data-for={'5'} />, text: 'Settings (⇧⌘/)', active: false }
];

const Template = (args: any = {}) => {
    const [text, updateText] = useState('');

    
    return <ActivityBar {...args.ActivityBar} >
        {text !== '' && <span data-testid='validate-text'>{text}</span>}
        {
            (typeof args.CompositeBar !== "undefined" || typeof args.ActionBar !== "undefined") &&
            (<>
                {typeof args.CompositeBar !== "undefined" && (<ActivityBar.CompositeBar {...args.CompositeBar} items={compositeBarList} 
                onClickItem={(item:  {id:number, text: string,icon: () => {},active: boolean}) => updateText(item.text)}/>)}
                {typeof args.ActionBar !== "undefined" && (<ActivityBar.ActionBar {...args.ActionBar}  items={actionBarList}
                 onClickItem={(item: {id:number, text: string,icon: () => {},active: boolean}) => updateText(item.text)}
                />)}
            </>)
        }
    </ActivityBar>
}

describe("ActivityBar component", () => {

    test("should render the wrapper div with provided props", () => {
        const { container } = render(<Template
            ActivityBar={{
                id: 'activity-bar-container',
                className: 'activity-bar-classname',
                style: { 'maxWidth': '200px' },
            }}
            CompositeBar
            ActionBar
        />);
        const ActivityBarWrapper = container.firstElementChild;
        const CompositeBar = screen.getByTestId('activitybar-composite-bar');
        const ActionBar = screen.getByTestId('activitybar-action-bar');

        //validate the wrapper component attributes
        expect(ActivityBarWrapper).toHaveClass('activity-bar-classname activitybar focus-outer2 w-12 bg-activityBar-background text-activityBar-foreground flex flex-col  border-r border-activityBar-border');
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
        const { container } = render(<Template
            ActivityBar={{
                id: 'activity-bar-container',
                className: 'activity-bar-classname',
                style: { 'maxWidth': '200px' },
            }}
            CompositeBar
        />);
        const ActivityBarWrapper = container.firstElementChild;
        const CompositeBar = screen.getByTestId('activitybar-composite-bar');

        //validate the wrapper component attributes
        expect(ActivityBarWrapper).toHaveClass('activity-bar-classname activitybar focus-outer2 w-12 bg-activityBar-background text-activityBar-foreground flex flex-col  border-r border-activityBar-border');
        expect(ActivityBarWrapper.id).toBe("activity-bar-container");
        expect(ActivityBarWrapper).toHaveStyle({ 'max-width': '200px' })

        expect(ActivityBarWrapper.childElementCount).toBe(1);

        // validate CompositeBar props
        expect(CompositeBar).toHaveClass('composite-bar');
        expect(CompositeBar.childElementCount).toBe(compositeBarList.length);
        
  
    });

    test("should render with ActionBar only", () => {
        const { container } = render(<Template
            ActivityBar={{
                id: 'activity-bar-container',
                className: 'activity-bar-classname',
                style: { 'maxWidth': '200px' },
            }}
            ActionBar
        />);
        const ActivityBarWrapper = container.firstElementChild;
        const ActionBar = screen.getByTestId('activitybar-action-bar');

        //validate the wrapper component attributes
        expect(ActivityBarWrapper).toHaveClass('activity-bar-classname activitybar focus-outer2 w-12 bg-activityBar-background text-activityBar-foreground flex flex-col  border-r border-activityBar-border');
        expect(ActivityBarWrapper.id).toBe("activity-bar-container");
        expect(ActivityBarWrapper).toHaveStyle({ 'max-width': '200px' })

        expect(ActivityBarWrapper.childElementCount).toBe(1);

        //validate ActionBar props
        expect(ActionBar).toHaveClass('action-bar mt-auto');
        expect(ActionBar.childElementCount).toBe(actionBarList.length);

    });

    test("should update the text of label with CompositeBar & ActionBar click action", async () => {
        const { container } = render(<Template
            CompositeBar
            ActionBar
        />);
        const ActivityBarWrapper = container.firstElementChild;
        const CompositeBar = screen.getByTestId('activitybar-composite-bar');
        const ActionBar = screen.getByTestId('activitybar-action-bar');

        expect(ActivityBarWrapper).toBeInTheDocument();

        //Validate click action for CompositeBar List Item
        click(CompositeBar.lastElementChild as HTMLDivElement);
        await waitFor(() => {
            const DivWithClickedItemText = screen.queryByTestId('validate-text');
            expect(DivWithClickedItemText.textContent).toBe(compositeBarList[2].text)
        });

        //Validate click action for ActionBar List Item
        click(ActionBar.firstElementChild as HTMLDivElement);
        await waitFor(() => {
            const DivWithClickedItemText = screen.queryByTestId('validate-text');
            expect(DivWithClickedItemText.textContent).toBe(actionBarList[0].text)
        });
    });

});