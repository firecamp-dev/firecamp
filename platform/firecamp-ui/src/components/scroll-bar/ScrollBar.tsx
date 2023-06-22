import * as ScrollArea from '@radix-ui/react-scroll-area';
import cx from 'classnames';

const ScrollBar = ({
  children = <></>,
  className = '',
  noWrap = false,
  withCorner = false,
  transparent = false,
  fullWidth = false,
  fullHeight = false,
}) => (
  <ScrollArea.Root
    className={cx(
      'overflow-hidden',
      { 'whitespace-nowrap': noWrap },
      { 'w-full': fullWidth },
      { 'h-full': fullHeight },
      className
    )}
    style={{
      '--scrollbar-size': '8px',
    } as React.CSSProperties}
    type="hover"
  >
    {/**
     * TODO: update classname `[&>div]:!block` when issue is resolved
     * @ref: https://github.com/radix-ui/primitives/issues/926#issuecomment-1447283516
     */}
    <ScrollArea.Viewport className={cx('w-full h-full [&>div]:!block')}>
      {children}
    </ScrollArea.Viewport>

    {/* horizontal scrollbar */}
    <ScrollArea.Scrollbar
      className={cx(
        'flex flex-col select-none touch-none p-0.5 ',
        {
          'bg-activityBar-border hover:bg-focus2': !transparent,
        },
        {
          'p-0 bg-transparent': transparent,
        }
      )}
      orientation="horizontal"
      style={{
        height: 'var(--scrollbar-size)',
        touchAction: 'none',
        transition: 'background 160ms ease-out',
      }}
    >
      <ScrollArea.Thumb
        className={cx('flex-1 bg-focus4 rounded')}
      />
    </ScrollArea.Scrollbar>

    {/* vertical scrollbar */}
    <ScrollArea.Scrollbar
      className={cx(
        'flex select-none touch-none p-0.5',
        {
          'bg-activityBar-border hover:bg-focus2': !transparent,
        },
        {
          'p-0 bg-transparent': transparent,
        }
      )}
      orientation="vertical"
      style={{
        width: 'var(--scrollbar-size)',
        touchAction: 'none',
        transition: 'background 160ms ease-out',
      }}
    >
      <ScrollArea.Thumb
        className={cx('flex-1 bg-focus4 rounded')}
      />
    </ScrollArea.Scrollbar>

    {withCorner && <ScrollArea.Corner className="bg-transparent" />}
  </ScrollArea.Root>
);
export default ScrollBar;
