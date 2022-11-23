import { FC } from "react";
import { _object } from '@firecamp/utils';
import { VscCircleFilled } from '@react-icons/all-files/vsc/VscCircleFilled';

import classnames from 'classnames';
import Count from './Count';
import { ISecondaryTab } from './interfaces/SecondaryTab.interfaces';

// TODO: check component usage, props

/**
 * TabItem: Tab Item (single)
 * @param tab: object // {id:"",name:"",count:""}
 * @param isActive: boolean // true if active tab, else false
 * @param onSelect: func // function that returns tab id on select
 * @constructor
 */
const TabItem = (tabData: {
  tab: any;
  isActive: boolean;
  onSelect: (tabId: string) => void;
}) => {
  let { tab, isActive, onSelect } = tabData;
  return (
    <div
      className={classnames(
        { selected: isActive == true },
        { 'border-primaryColor text-appForegroundActive': isActive == true },
        { 'border-transparent text-appForegroundInActive': isActive == false },
        'mx-2 border-b-2 flex cursor-pointer'
      )}
      onClick={() => onSelect(tab.id)}
    >
      {tab.name}{' '}
      {_object.has(tab, 'count') && tab.count && tab.count > 0 ? (
        <Count number={tab.count} />
      ) : (
        ''
      )}
      {tab?.dotIndicator === true ? (
        <div className={'flex items-center text-primaryColor opacity-100'}>
          <VscCircleFilled size={10} />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const SecondaryTab: FC<ISecondaryTab> = ({
  className = '',
  list = [],
  activeTab = '',
  isBgTransperant = false,
  components = { button: '', controls: '' },
  additionalComponent = '',
  onSelect = () => {},
}) => {
  let { button, controls } = components;

  return (
    <div className={'flex w-full'}>
      <div
        className={classnames(
          {
            'flex text-base items-center py-1 bg-transparent ': isBgTransperant,
          },
          'flex text-base items-center w-full' ,
          className
        )}
      >
        {list.map((tab, id) => {
          return (
            <TabItem
              isActive={activeTab == tab.id}
              tab={tab}
              onSelect={onSelect}
              key={id}
            />
          );
        })}
        {button ? button : ''}
        {controls ? controls : ''}
       <div className=" ml-auto mr-2">

       {additionalComponent ? additionalComponent : ''}
      </div>
    </div>
    </div>
  );
};

export default SecondaryTab;
