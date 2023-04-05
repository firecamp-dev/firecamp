import * as ScrollArea from '@radix-ui/react-scroll-area';
import cx from 'classnames';

export enum SCROLLBAR_LAYOUT {
  DEFAULT = 'DEFAULT',
  V1 = 'V1',
  V2 = 'V2',
  HORIZONTAL = 'HORIZONTAL',
  THIN = 'THIN',
}
const ScrollBar = ({
  children = <></>,
  className = '',
  noWrap = false,
  width = '',
  height = '',
  layout = SCROLLBAR_LAYOUT.DEFAULT,
  withCorner = true,
}) => (
  <ScrollArea.Root
    className={cx(
      'overflow-hidden ',
      { 'whitespace-nowrap': noWrap },
      width,
      height,
      className
    )}
    style={{
      '--scrollbar-size': layout === SCROLLBAR_LAYOUT.DEFAULT ? '4px' : '8px',
    }}
    type="hover"
  >
    <ScrollArea.Viewport className={cx('w-full h-full')}>
      {children}
    </ScrollArea.Viewport>

    {/* horizontal scrollbar */}
    <ScrollArea.Scrollbar
      className={cx(
        'flex flex-col select-none touch-none p-0.5 ',
        {
          'bg-activityBarBorder hover:bg-focus2':
            layout === SCROLLBAR_LAYOUT.V1,
        },
        {
          'p-0 bg-transparent': layout === SCROLLBAR_LAYOUT.V2,
        },
        {
          'p-0 bg-transparent': layout === SCROLLBAR_LAYOUT.DEFAULT,
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
        className={cx('flex-1 bg-appForegroundInActive', {
          rounded: layout === SCROLLBAR_LAYOUT.HORIZONTAL,
        })}
      />
    </ScrollArea.Scrollbar>

    {/* vertical scrollbar */}
    {layout !== SCROLLBAR_LAYOUT.HORIZONTAL && (
      <ScrollArea.Scrollbar
        className={cx(
          'flex select-none touch-none p-0.5',
          {
            'bg-activityBarBorder hover:bg-focus2':
              layout === SCROLLBAR_LAYOUT.V1,
          },
          {
            'p-0 bg-transparent': layout === SCROLLBAR_LAYOUT.V2,
          },
          {
            'p-0 bg-transparent': layout === SCROLLBAR_LAYOUT.DEFAULT,
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
          className={cx(
            'flex-1',
            {
              'bg-appForegroundInActive': layout !== SCROLLBAR_LAYOUT.DEFAULT,
            },
            {
              'bg-appBorder rounded-2xl': layout === SCROLLBAR_LAYOUT.DEFAULT,
            }
          )}
        />
      </ScrollArea.Scrollbar>
    )}

    {withCorner && <ScrollArea.Corner className="bg-transparent" />}
  </ScrollArea.Root>
);
export default ScrollBar;
