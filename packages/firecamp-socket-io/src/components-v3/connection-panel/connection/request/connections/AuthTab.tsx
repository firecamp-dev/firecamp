//@ts-nocheck

import { BulkEditIFT } from '@firecamp/ui-kit';

const AuthTab = ({
  auth = [],
  activeconnectionId = '',
  onUpdate = () => {}
}) => {
  return (
    <BulkEditIFT
      onChange={onUpdate}
      key={`auth-${activeconnectionId}`}
      id={`auth-${activeconnectionId}`}
      rows={auth || []}
      name={'auth'}
      meta={{
        mode: {
          key: 'ife-header-key',
          value: 'ife-header-value'
        }
      }}
    />
  );
};

export default AuthTab;
