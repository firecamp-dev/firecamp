// @ts-nocheck
import { FC } from 'react';
import { SecondaryTab, TabHeader } from '@firecamp/ui-kit';

const Header: FC<IHeader> = ({
  controls = [],
  activeControl = '',
  onSelectTargetControl = (_) => {},
}) => {
  return (
    <TabHeader className="converter-left-header">
      <div>
        <SecondaryTab
          list={(Object.values(controls) || []).map((c) => {
            return { id: c.key, name: c.name };
          })}
          activeTab={activeControl}
          onSelect={(tab) => onSelectTargetControl(tab)}
        />
      </div>
    </TabHeader>
  );
};

export default Header;

interface IHeader {
  /**
   * Target controls
   */
  controls: object;

  /**
   * Active control/ type from tab
   */
  activeControl: string;

  /**
   * Select target type
   */
  onSelectTargetControl: (type: string) => void;
}
