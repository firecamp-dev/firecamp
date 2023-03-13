import * as ScrollArea from '@radix-ui/react-scroll-area';
import classnames from 'classnames';

const SCROLLBAR_VERSION = {
  V1: 'V1',
  V2: 'V2',
};
const ScrollBar = ({
  children = <></>,
  className = '',
  noWrap = false,
  width = '',
  height = '',
  layout = SCROLLBAR_VERSION.V1,
}) => (
  <ScrollArea.Root
    className={classnames(
      'overflow-hidden ',
      { 'whitespace-nowrap': noWrap },
      width,
      height,
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
      className={classnames(
        'flex flex-col select-none touch-none p-0.5 ',
        {
          'bg-activityBarBorder hover:bg-focus2':
            layout === SCROLLBAR_VERSION.V1,
        },
        {
          'p-0 bg-transparent':
            layout === SCROLLBAR_VERSION.V2,
        }
      )}
      orientation="horizontal"
      style={{
        height: 'var(--scrollbar-size)',
        touchAction: 'none',
        transition: 'background 160ms ease-out',
      }}
    >
      <ScrollArea.Thumb className="flex-1 bg-appForegroundInActive" />
    </ScrollArea.Scrollbar>

    {/* vertical scrollbar */}
    <ScrollArea.Scrollbar
      className={classnames(
        'flex select-none touch-none p-0.5',
        {
          'bg-activityBarBorder hover:bg-focus2':
            layout === SCROLLBAR_VERSION.V1,
        },
        {
          'p-0 bg-transparent':
            layout === SCROLLBAR_VERSION.V2,
        }
      )}
      orientation="vertical"
      style={{
        width: 'var(--scrollbar-size)',
        touchAction: 'none',
        transition: 'background 160ms ease-out',
      }}
    >
      <ScrollArea.Thumb className="flex-1 bg-appForegroundInActive" />
    </ScrollArea.Scrollbar>

    <ScrollArea.Corner className="bg-transparent" />
  </ScrollArea.Root>
);
export default ScrollBar;
