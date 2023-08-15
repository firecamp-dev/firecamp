import { FC, useMemo } from 'react';
import { Container, QuickSelection } from '@firecamp/ui';
import { EAuthTypes } from '@firecamp/types';

const NoAuth: FC<IProps> = ({
  onChangeAuthType = (authType: EAuthTypes) => {},
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
            onChangeAuthType(authTypeList[k].id);
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

interface IProps {
  /** update active auth */
  onChangeAuthType: (authType: EAuthTypes) => void;

  /** auth types */
  authTypeList: any;
}
