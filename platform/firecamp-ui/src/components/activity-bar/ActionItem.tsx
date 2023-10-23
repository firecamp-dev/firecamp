import { FC, forwardRef } from 'react';
import cx from 'classnames';
import { UserCircle2 } from 'lucide-react';
import Tooltip from '../tooltip/Tooltip';

const ActionItem: FC<IActionItem> = ({
  id = '',
  className = '',
  style = {},
  active = false,
  onClick = () => {},
  icon = '',
  tooltip,
}) => {
  const Item = forwardRef<HTMLDivElement, IActionItem>(
    (
      {
        active = false,
        className = '',
        style = {},
        onClick = () => {},
        icon = '',
      },
      ref
    ) => (
      <div
        tabIndex={1}
        className={cx(
          'h-12 flex justify-center items-center cursor-pointer relative text-2xl action-item',
          {
            'text-activityBar-foreground-inactive hover:text-activityBar-foreground':
              active == false,
          },
          {
            'before:block before:z-0 before:content-[""] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-0.5 before:bg-activityBar-border-active text-activityBar-foreground bg-activityBar-background-active':
              active == true,
          },
          className
        )}
        style={style}
        onClick={onClick}
        data-for={id}
        ref={ref}
      >
        {!!icon ? icon : <UserCircle2 tabIndex={-1} data-for={id} />}
      </div>
    )
  );

  return tooltip ? (
    <Tooltip
      arrowOffset={5}
      arrowSize={6}
      arrowPosition="side"
      label={tooltip}
      position="right"
      withArrow={true}
    >
      <Item
        active={active}
        className={className}
        id={id}
        onClick={onClick}
        style={style}
        icon={icon}
      />
    </Tooltip>
  ) : (
    <Item
      active={active}
      className={className}
      id={id}
      icon={icon}
      onClick={onClick}
      style={style}
    />
  );
};

export default ActionItem;

ActionItem.defaultProps = {
  id: null,
  className: null,
  active: false,
  icon: '',
  tooltip: '',
};

export interface IActionItem {
  /**
   * Is this the principal call to action on the page?
   */
  id?: string;
  /**
   * Add class name to show custom styling
   */
  className?: string;
  /**
   * apply css styles
   */
  style?: any;
  /**
   * to show if item active
   */
  active: boolean;
  /**
   * To show icon for action
   */
  icon: string;
  /**
   * Add a tooltip
   */
  tooltip?: string;

  onClick: () => void;
}
