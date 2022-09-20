import { FC, useMemo } from 'react';

import { Container, QuickSelection } from '@firecamp/ui-kit';
import { EAuthTypes } from '@firecamp/types';

const NoAuth: FC<INoAuth> = ({
  onChangeActiveAuth = (authType: EAuthTypes) => {},
  typeList = [],
}) => {
  /**
   * MENUS
   */
  let menus = useMemo(() => {
    /**
     * AUTH TYPES
     */
    let authTypesList = [];
    for (let k in typeList) {
      if (typeList[k].id !== EAuthTypes.NoAuth && typeList[k].enable) {
        authTypesList.push({
          id: typeList[k].id,
          name: typeList[k].name,
          onClick: () => {
            onChangeActiveAuth(typeList[k].id);
          },
        });
      }
    }
    return [
      {
        title: 'Quick auth type selection',
        items: authTypesList,
        active_item: EAuthTypes.NoAuth,
      },
    ];
  }, []);

  return (
    <Container>
      <Container.Empty>
        <QuickSelection menus={menus} />
      </Container.Empty>
    </Container>
  );
};
export default NoAuth;

interface INoAuth {
  /**
   * Update active auth
   */
  onChangeActiveAuth: (authType: EAuthTypes) => void;

  /**
   * Auth types
   */
  typeList: any;
}
