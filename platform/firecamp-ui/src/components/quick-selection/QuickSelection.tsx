import { FC, Key, ReactChild, ReactFragment, ReactPortal } from 'react';
import classnames from 'classnames';
import { IQuickSelection } from './interfaces/QuickSelection.interface';

/**
 * QuickSelection: To show select data type if no_body type is selected in client
 */
const QuickSelection: FC<IQuickSelection> = ({ menus = [] }) => {
  return (
    <div>
      {menus.map((menu, i) => {
        const { title, items = [], activeItem } = menu;
        return (
          <div className="mb-4 p-2 relative z-0" key={i}>
            <div className="w-fit text-appForegroundInActive bg-app-background text-base ml-2 px-1 absolute z-10 top-0">
              {title}
            </div>
            <div className="pb-1 pt-3 px-1 flex items-center border-t border-l border-r border-appBorder flex-wrap">
              {items.map((item: any, k: number) => (
                <Item {...item} activeItem={activeItem} key={k} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickSelection;

const Item: FC<{
  id: string;
  onClick: () => void;
  name: boolean | ReactChild | ReactFragment | ReactPortal;
  activeItem?: string;
}> = ({ id, name, activeItem, onClick }) => {
  return (
    <div
      className={classnames(
        { active: id === activeItem },
        'cursor-pointer mx-2 text-base border-b opacity-60 border-transparent hover:text-primaryColor hover:border-primaryColor hover:opacity-100'
      )}
      onClick={() => {
        onClick();
      }}
    >
      {name}
    </div>
  );
};
