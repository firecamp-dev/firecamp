import { useMemo } from 'react';
import { Container, QuickSelection } from '@firecamp/ui';
import { ERestBodyTypes } from '@firecamp/types';

import { bodyTypeNames } from '../../../../constants';

const NoBodyTab = ({ selectBodyType }) => {
  const menus = useMemo(() => {
    let bodyTypes = [];
    for (let type in bodyTypeNames) {
      if (type) {
        bodyTypes.push({
          id: bodyTypeNames[type],
          name: bodyTypeNames[type],
          onClick: () => {
            selectBodyType({ id: type }); //ERestBodyTypes
          },
        });
      }
    }
    return [
      {
        title: 'Quick body type selection',
        items: bodyTypes,
        activeItem: '',
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
export default NoBodyTab;
