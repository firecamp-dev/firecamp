//@ts-nocheck
import Popover from './Popover';
import { EPopoverPosition } from './interfaces/Popover.interfaces';

export default {
    title: "UI-Kit/Popover",
};

const Template = () => {

    return (
        <div className='bg-app-background h-screen w-screen text-app-foreground p-8'>
            <Popover id={1} key={1} content={<Content text={"Hi! I'm popover content. Here's my position"} />}>
                <Popover.Handler>
                    <div className='inline'>Click</div>
                </Popover.Handler>
            </Popover>
            <Popover
                id={2}
                key={2}
                content={<Content text={"Hi! I'm popover content. I won't close on click outside"} />}
                closeOnClickOutside={false}
            >
                <Popover.Handler>
                    <div>Do not close on outside</div>
                </Popover.Handler>
            </Popover>
            <Popover
                id={2}
                key={2}
                content={<Content text={"Hi! I'm popover content. I'm at bottom!"} />}
                closeOnClickOutside={false}
                positions={[EPopoverPosition.Bottom]}
            >
                <Popover.Handler>
                    <div>Click to open bottom</div>
                </Popover.Handler>
            </Popover>
        </div>
    )
}

export const PopoverDemo = Template.bind({});

const Content = ({ text = '' }) => {
    return (
        <div>{text}</div>
    )
}