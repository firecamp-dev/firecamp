import { Fragment, FC } from 'react';
import ActionItem from './ActionItem';

const ActionItems: FC<IActionItems> = ({
  items = [],
  activeItem = '',
  onClickItem = () => {},
}) => {
  return (
    <Fragment>
      {items.map((item: any, i: number) => (
        <ActionItem
          id={item.id}
          icon={item.icon}
          tooltip={item.tooltip}
          key={i}
          active={activeItem === item.id}
          onClick={() => {
            onClickItem(item);
          }}
        />
      ))}
    </Fragment>
  );
};

export default ActionItems;

ActionItems.defaultProps = {
  id: '',
  className: '',
  items: [],
};

export interface IActionItems {
  activeItem?: string;

  onClickItem: (action: any) => void;
  /**
   * Is this the principal call to action on the page?
   */
  id?: string;
  /**
   * Add class name to show custom styling
   */
  className?: string;
  /**
   * to show list of action items
   */
  items?: any[];
}
