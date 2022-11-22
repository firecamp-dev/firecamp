import { useState } from 'react';
import classnames from 'classnames';
import { Resizable } from '@firecamp/ui-kit';

import Head from './Head';
import Body from './Body';

const Listeners = () => {
  let [isCollapsed, toggleCollapsed] = useState(false);

  return (
    <Resizable
      width="170px"
      minWidth={100}
      maxWidth={400}
      height="100%"
      flex="none"
      left={true}
      className={classnames(
        { 'fc-collapsed fc-collapsed-v3': isCollapsed },
        'fc-collapsable'
      )}
    >
      <Head toggleCollapsed={toggleCollapsed} />
      <Body toggleCollapsed={toggleCollapsed} />
    </Resizable>
  );
};

export default Listeners;
