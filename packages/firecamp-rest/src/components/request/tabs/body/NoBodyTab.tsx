import { useMemo } from 'react';
import { Container, QuickSelection } from '@firecamp/ui-kit';
import { ERestBodyTypes } from '@firecamp/types';

import { bodyTypeNames } from '../../../../constants';

const NoBodyTab = ({ selectBodyType = ({ id: ERestBodyTypes }) => {} }) => {
  const menus = useMemo(() => {
    let bodyTypes = [];
    for (let type in bodyTypeNames) {
      if (type !== ERestBodyTypes.NoBody) {
        bodyTypes.push({
          id: bodyTypeNames[type],
          name: bodyTypeNames[type],
          onClick: () => {
            selectBodyType({ id: type });
          },
        });
      }
    }
    return [
      {
        title: 'Quick body type selection',
        items: bodyTypes,
        active_item: ERestBodyTypes.NoBody,
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
