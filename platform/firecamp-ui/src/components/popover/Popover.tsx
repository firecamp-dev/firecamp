import { FC, useState, useEffect, forwardRef } from 'react';
import { Popover as ReactTinyPopover, ArrowContainer } from 'react-tiny-popover';
import classNames from 'classnames';

import { IPopover, IHandler, EPopoverPosition } from "./interfaces/Popover.interfaces"

/**    
 * Firecamp Popover
 */
const Popover: FC<IPopover> & {
  Handler: FC<IHandler>
}
  = ({
    id = '',
    className = '',
    children = [],
    content = '',
    closeOnClickOutside = true,
    detach = true,
    isOpen: propIsOpen = false,
    positions = [],
    onToggleOpen = () => { }
  }) => {


    let [isOpen, toggleOpen] = useState(false);

    useEffect(() => {
      if (detach === false) {
        toggleOpen(propIsOpen);
      }
    }, [propIsOpen]);

    let _onToggleOpen = (value: any) => {
      if (onToggleOpen && detach === false) {
        onToggleOpen(value);
      }
      if (detach === true) {
        toggleOpen(value);
      }
    };


    /**  
     * To add isOpen and onToggleOpen props in each child
     */
    if (children) {
      children = Object.assign({}, children, {
        props: Object.assign({}, children.props, {
          isOpen,
          toggleOpen: () => _onToggleOpen(!isOpen)
        }),
      })
    }

    return (
      <ReactTinyPopover
        // id={id}
        isOpen={isOpen}
        positions={positions?.length ? positions : [EPopoverPosition.Bottom, EPopoverPosition.Top, EPopoverPosition.Right, EPopoverPosition.Left]}
        padding={2}
        onClickOutside={() => _onToggleOpen(!closeOnClickOutside)}
        content={({ position, childRect, popoverRect }) => {
          return (
            <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={'white'}
              arrowSize={8}
              arrowStyle={{ opacity: 1 }}
              className='popover-arrow-container'
              arrowClassName={classNames('popover-arrow',
                { '!border-b-popover-background': (position == 'bottom') },
                { '!border-t-popover-background': (position == 'top') },
                { '!border-l-popover-background': (position == 'left') },
                { '!border-r-popover-background': (position == 'right') }
              )}
            >
              <div
                className={classNames('bg-popover-background text-popover-foreground text-left text-sm popover-boxshadow rounded-sm', className)}
              >
                {content || ''}
              </div>
            </ArrowContainer>
          )
        }}
      >
        {children || ''}
      </ReactTinyPopover >
    );
  };


const Handler = forwardRef<HTMLDivElement, IHandler>(({
  className = '',
  children = '', toggleOpen = () => { }, tooltip = '' }, ref) => {

  return (
    <div ref={ref} onClick={(e)=>toggleOpen(true)} className={classNames("inline cursor-pointer", className)}
      data-tip={tooltip}
    >
      {children}
    </div>
  )
});

Popover.Handler = Handler

export default Popover;