import { FC, useMemo } from 'react';
import { Container, QuickSelection } from '@firecamp/ui-kit';
import { EAuthTypes } from '@firecamp/types';

const NoAuth: FC<INoAuth> = ({
  onChangeActiveAuth = (authType: EAuthTypes) => {},
  authTypeList = [],
}) => {

  const menus = useMemo(() => {
    const options = [];
    for (const k in authTypeList) {
      if (authTypeList[k].id !== EAuthTypes.None && authTypeList[k].enable) {
        options.push({
          id: authTypeList[k].id,
          name: authTypeList[k].name,
          onClick: () => {
            onChangeActiveAuth(authTypeList[k].id);
          },
        });
      }
    }
    return [
      {
        title: 'Quick auth type selection',
        items: options,
        activeItem: EAuthTypes.None,
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
  /** update active auth */
  onChangeActiveAuth: (authType: EAuthTypes) => void;

  /** auth types */
  authTypeList: any;
}
