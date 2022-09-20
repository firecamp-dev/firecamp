import { FC } from 'react';
import { SecondaryTab } from '@firecamp/ui-kit';

import { EConverterLang } from '../types';
import { ITargetState } from './Target';

const { JSON: Json, XML, YAML } = EConverterLang;

const Controls: FC<IControls> = ({
  target: { allowedTypes, type },
  sourceType = '',

  onSelectTargetType = () => {},
}) => {
  return (
    <div className="tab-panel-header-button-wrapper">
      {[XML, Json, YAML].includes(type) &&
      allowedTypes?.[type]?.controls?.[sourceType] &&
      allowedTypes?.[type]?.activeControl?.[sourceType] ? (
        <SecondaryTab
          list={allowedTypes[type].controls[sourceType].map((c, i) => {
            return {
              id: c,
              name: c,
            };
          })}
          activeTab={allowedTypes[type].activeControl[sourceType]}
          className="flex text-base items-center py-1 bg-transparent bg-transparent"
          onSelect={(tab: string) => onSelectTargetType(type, tab)}
        />
      ) : (
        <div
          className="mx-2 border-b-2 ml-auto right-aligned"
          style={{ height: 36 }}
        >
          {' '}
        </div>
      )}
    </div>
  );
};

export default Controls;

interface IControls {
  target: ITargetState;

  /**
   * Source data type
   */
  sourceType: string;

  /**
   * Select target type and sub-type
   */
  onSelectTargetType: (type: string, subType: string) => any;
}
