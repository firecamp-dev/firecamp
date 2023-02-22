import { BulkEditTable } from '@firecamp/ui-kit';

const AuthTab = ({
  auth = [],
  activeConnectionId = '',
  onUpdate = () => {}
}) => {
  return (
    <BulkEditTable
      onChange={onUpdate}
      key={`auth-${activeConnectionId}`}
      id={`auth-${activeConnectionId}`}
      rows={auth || []}
      title={'Auth'}
    />
  );
};

export default AuthTab;
