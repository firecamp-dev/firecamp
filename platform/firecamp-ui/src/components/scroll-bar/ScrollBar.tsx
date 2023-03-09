import * as ScrollArea from '@radix-ui/react-scroll-area';
import classnames from 'classnames';

const ScrollBar = ({ children = <></>, className = '', noWrap = false }) => (
  <ScrollArea.Root
    className={classnames(
      'rounded overflow-hidden shadow-md bg-primaryColorText',
      {'whitespace-nowrap': noWrap },
      className
    )}
    style={{ '--scrollbar-size': '10px' }}
   type="always"
  >
    <ScrollArea.Viewport className={classnames('w-full h-full')}>
      {children}
    </ScrollArea.Viewport>

    {/* horizontal scrollbar */}
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

    {/* vertical scrollbar */}
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
