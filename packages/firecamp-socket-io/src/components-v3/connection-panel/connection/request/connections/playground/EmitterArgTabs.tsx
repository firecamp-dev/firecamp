//@ts-nocheck

import { useEffect, useState } from 'react';
import { Container, Checkbox, Tabs } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { EMITTER_PAYLOAD_TYPES } from '../../../../../../constants';

const EmitterArgTabs = ({
  ack = false,
  args = [],
  activeArgIndex = '',
  onAddArg = () => {},
  onRemoveArg = () => {},
  toggleAck = () => {},
  onSelectArgTab = () => {}
}) => {
  let [tabs, setTabs] = useState(
    args.map((arg, index) => {
      return {
        id: index,
        name: `Arg ${index + 1}`
      };
    })
  );

  useEffect(() => {
    let newTabs = args.map((arg, index) => {
      return {
        id: index,
        name: `Arg ${index + 1}`
      };
    });

    if (!equal(tabs, newTabs)) {
      setTabs(newTabs);
    }
  }, [args]);

  return (
    <Tabs
    list={tabs || []}
        activeTab={activeArgIndex}
        // tabsClassName="tabs-with-bottom-border-left-section"
        closeTabIconMeta={{
          show: tabs.length > 0,
          onClick: onRemoveArg
        }}
        addTabIconMeta={{
          show:
            tabs &&
            tabs.length < 5 &&
            args[activeArgIndex]?.meta?.type !== EMITTER_PAYLOAD_TYPES.no_body,
          onClick: onAddArg
        }}
        tabBorderMeta={{
          placementForActive: '',
          right: true
        }}
        onSelect={onSelectArgTab}
        postComp={_ => (
          <Checkbox
            isChecked={ack}
            label="Ack"
            onToggleCheck={_ => toggleAck(!ack)}
          />
        )}
      />
  );
};
export default EmitterArgTabs;
