import * as ScrollArea from '@radix-ui/react-scroll-area';
import cx from 'classnames';

export enum EScrollbarLayout {
  Default = 'default',
  V1 = 'v1',
  V2 = 'v2',
  Horizontal = 'horizontal',
  Thin = 'thin',
}
const ScrollBar = ({
  children = <></>,
  className = '',
  noWrap = false,
  width = '',
  height = '',
  layout = EScrollbarLayout.Default,
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
      '--scrollbar-size': layout === EScrollbarLayout.Default ? '4px' : '8px',
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
            layout === EScrollbarLayout.V1,
        },
        {
          'p-0 bg-transparent': layout === EScrollbarLayout.V2,
        },
        {
          'p-0 bg-transparent': layout === EScrollbarLayout.Default,
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
          rounded: layout === EScrollbarLayout.Horizontal,
        })}
      />
    </ScrollArea.Scrollbar>

    {/* vertical scrollbar */}
    {layout !== EScrollbarLayout.Horizontal && (
      <ScrollArea.Scrollbar
        className={cx(
          'flex select-none touch-none p-0.5',
          {
            'bg-activityBarBorder hover:bg-focus2':
              layout === EScrollbarLayout.V1,
          },
          {
            'p-0 bg-transparent': layout === EScrollbarLayout.V2,
          },
          {
            'p-0 bg-transparent': layout === EScrollbarLayout.Default,
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
              'bg-appForegroundInActive': layout !== EScrollbarLayout.Default,
            },
            {
              'bg-appBorder rounded-2xl': layout === EScrollbarLayout.Default,
            }
          )}
        />
      </ScrollArea.Scrollbar>
    )}

    {withCorner && <ScrollArea.Corner className="bg-transparent" />}
  </ScrollArea.Root>
);
export default ScrollBar;
