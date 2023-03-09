import { FC, Fragment } from 'react';
import ActionItem from './ActionItem';

/**
 * ActionBar
 */
 const ActionBar: FC<IActionBar> = ({
  id= '',
  className= '',
  items= [],
}) => {
  return (
    <Fragment>
      {items.map((item: any, i: number) => 
          (
            <ActionItem 
              id={item.id}
              icon={item.icon}
              tooltip={item.text}
              key={i}
              active={item.active}
              onClick={()=> {}}/>                   
          )
      )}
    </Fragment>
  );
};

export default ActionBar

interface IActionBar {
    /**
     * identifier
     */
    id: string | number,
    /**
     * add class name to show custom styling
     */
    className?: string,
    /**
     * list of action items
     */
    items: any[]
};
  
ActionBar.defaultProps = {
    id: 0,
    className: "",
    items: []
};