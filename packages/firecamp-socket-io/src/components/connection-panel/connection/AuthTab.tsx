import shallow from 'zustand/shallow';
import { BulkEditTable } from '@firecamp/ui';
import { IStore, useStore } from '../../../store';

const AuthTab = ({ id = '' }) => {
  const { auth, updateConnection } = useStore(
    (s: IStore) => ({
      auth: s.request.connection.auth,
      updateConnection: s.updateConnection,
    }),
    shallow
  );
  return (
    <BulkEditTable
      key={`auth-${id}`}
      id={`auth-${id}`}
      rows={auth || []}
      title={'Auth'}
      onChange={(auth) => {
        updateConnection('auth', auth);
      }}
    />
  );
};

export default AuthTab;
