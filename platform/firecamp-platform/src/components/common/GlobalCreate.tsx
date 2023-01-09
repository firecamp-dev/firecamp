import { useState } from 'react';
import classnames from 'classnames';
import { Dropdown, Button } from '@firecamp/ui-kit';

const GlobalCreateDD = ({}) => {
  const [isOpen, toggleOpen] = useState(false);
  const options = [
    {
      header: 'CREATE NEW',
      list: [
        { id: 'request', name: 'REQUEST' },
        { id: 'collection', name: 'COLLECTION' },
        { id: 'environment', name: 'ENVIRONMENT' },
        { id: 'import-collection', name: 'IMPORT COLLECTION' },
      ],
    },
    {
      header: 'Create New (by admin)',
      list: [
        { id: 'request', name: 'WORKSPACE' },
        { id: 'organization', name: 'ORGANIZATION' },
        { id: 'invite-members', name: 'INVITE MEMBERS' },
      ],
    },
  ];

  return (
    <div className="border-l border-b border-tabBorder flex items-center pl-1">
      <Dropdown
        detach={false}
        isOpen={isOpen}
        onToggle={() => {
          toggleOpen(!isOpen);
        }}
        selected={''}
      >
        <Dropdown.Handler>
          <Button
            text={'Create'}
            className={classnames('!text-primaryColor')}
            withCaret
            transparent
            ghost
            xs
          />
        </Dropdown.Handler>
        <Dropdown.Options
          options={options}
          onSelect={console.log}
          headerMeta={{ applyUpperCase: true }}
          hasDivider={true}
          className="type-1"
        />
      </Dropdown>
    </div>
  );
};
export default GlobalCreateDD;
