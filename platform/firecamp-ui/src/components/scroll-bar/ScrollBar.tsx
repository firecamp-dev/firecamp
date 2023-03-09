import * as ScrollArea from '@radix-ui/react-scroll-area';
import classnames from 'classnames';

const ScrollBar = ({ children = <></> }) => (
  <ScrollArea.Root
    className={classnames(
      'rounded overflow-hidden shadow-sm bg-primaryColorText',
      ' h-[225px] w-[200px]'
    )}
    style={{ '--scrollbar-size': '10px' }}
  >
    <ScrollArea.Viewport className={classnames('w-full h-full')}>
      {children}
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      className="flex flex-col select-none p-0.5 touch-none
      bg-activityBarBorder
       hover:bg-focus2"
      orientation="horizontal"
      style={{
        height: 'var(--scrollbar-size)',
        touchAction: 'none',
        transition: 'background 160ms ease-out',
      }}
    >
      <ScrollArea.Thumb className="flex-1 bg-appBackground" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar
      className="flex select-none p-0.5 touch-none
      bg-activityBarBorder
      hover:bg-focus2"
      orientation="vertical"
      style={{
        width: 'var(--scrollbar-size)',
        touchAction: 'none',
        transition: 'background 160ms ease-out',
      }}
    >
      <ScrollArea.Thumb className="flex-1 bg-appBackground" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner className="bg-focus2" />
  </ScrollArea.Root>
);
export default ScrollBar;
