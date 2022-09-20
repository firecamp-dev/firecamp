import { FC } from 'react';
import { SecondaryTab } from '@firecamp/ui-kit';

import { EConverterLang } from '../types';
import { ITargetState } from './Target';

const { XML } = EConverterLang;

const Header: FC<IHeader> = ({
  target: { allowedTypes = {}, type = '' },
  sourceType = '',
  onSelectTargetType,
}) => {
  return (
    <div className="keywords-wrapper">
      <SecondaryTab
        list={(Object.values(allowedTypes) || []).map((t) => {
          return {
            id: t.type,
            name: t.name,
          };
        })}
        activeTab={type}
        onSelect={(tab: string) =>
          sourceType === XML
            ? onSelectTargetType(tab, 'Compact')
            : onSelectTargetType(tab, 'Plain')
        }
      />
    </div>
  );
};

export default Header;

interface IHeader {
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
