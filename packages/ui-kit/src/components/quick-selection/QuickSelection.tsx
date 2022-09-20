import { FC, Key, ReactChild, ReactFragment, ReactPortal } from "react";
import classnames from 'classnames';

import { IQuickSelection } from "./interfaces/QuickSelection.interfcaes"

/**
 * QuickSelection: To show select data type if no_body type is selected in client
 */
const QuickSelection: FC<IQuickSelection> = ({ menus = [] }) => {
  return (
    <div>
      {menus.map((menu, i) => {
        return (
          <div className="mb-4 p-2 relative z-0" key={i}>
            <div className="w-fit text-appForegroundInActive bg-appBackground text-base ml-2 px-1 absolute z-10 top-0">{menu.title}</div>
            {menu.items ? (
              <div className="pb-1 pt-3 px-1 flex items-center border-t border-l border-r border-appBorder flex-wrap">
                {menu.items.map((item: { id: any; onClick: () => void; name: boolean | ReactChild | ReactFragment | ReactPortal; }, k: Key) => {
                  return (
                    <div
                      className={classnames(
                        { active: item.id === menu.active_item },
                        'cursor-pointer mx-2 text-base border-b opacity-60 border-transparent hover:text-primaryColor hover:border-primaryColor hover:opacity-100'
                      )}
                      key={k}
                      onClick={() => {
                        item.onClick();
                      }}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
            ) : (
              ''
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuickSelection;
