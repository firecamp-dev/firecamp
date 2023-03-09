import { FC, useMemo } from 'react';

import {
  Container,
  TabHeader,
  Column,
  Row,
  Resizable,
  // Collection
} from '@firecamp/ui';
import classnames from 'classnames';

import AddCookie from '../add-cookie/AddCookie';
import { ICookie } from '@firecamp/types';
import { ICookieFns } from '../CookieManager';
import { _object } from '@firecamp/utils';

const DomainItem: FC<IDomainItem> = ({
  item = {},
  className,
  onClick,
  tabIndex,
}) => {
  return (
    <div
      className={classnames('fc-setting-menu', className)}
      tabIndex={tabIndex}
      onClick={onClick}
    >
      <div className={classnames('fc-setting-menu-name')}>
        {item.name || ''}
      </div>
    </div>
  );
};

const Sidebar: FC<ISidebar> = ({
  cookiesByDomain = [],
  activeDomain = '',
  setActiveDomain = () => {},
  cookieFns = {},
  setCollectionRef = {},
}) => {
  let collection = useMemo(() => {
    if (_object.size(cookiesByDomain)) {
      return (
        Object.keys(cookiesByDomain).map((key, i) => {
          return { name: key, __ref: { id: key } };
        }) || []
      );
    } else {
      return [];
    }
  }, [cookiesByDomain]);

  let _onNodeFocus = (node) => {
    if (!node) return;
    if (node.name && node.name !== activeDomain) {
      setActiveDomain(node.name);
    }
  };
  // console.log(`collection`, collection);

  return (
    <Resizable
      width={226}
      maxWidth={'80%'}
      minWidth={'20%'}
      minHeight={'100%'}
      height={'100%'}
      maxHeight={'100%'}
      right={true}
    >
      <Column>
        <Row className="flex-col with-divider bg-appBackground2 fc-setting-content w-full">
          <Container>
            <Container.Header>
              <div className="fc-info-title small">Domains</div>
            </Container.Header>
            <Container.Body>
              {/* <Collection
                primaryKey="id"
                data={collection}
                showRootHeader={false}
                onNodeFocus={_onNodeFocus}
                nodeRenderer={({ item, classes, getNodeProps }) => {
                  // console.log(`item`, item);
                  return (
                    <DomainItem
                      item={item}
                      className={classes}
                      onSetVariables={() => { }}
                      {...getNodeProps()}
                    />
                  );
                }}
                onLoad={col => {
                  setCollectionRef.current = col;
                }}
              /> */}
            </Container.Body>
            <Container.Footer>
              <TabHeader>
                <div className="add-cookie-button">
                  <AddCookie
                    popoverID={`add-cookie-from-side-bar`}
                    cookieFns={cookieFns}
                  />
                </div>
              </TabHeader>
            </Container.Footer>
          </Container>
        </Row>
      </Column>
    </Resizable>
  );
};

export default Sidebar;

interface IDomainItem {
  /**
   * Domain
   */
  item: object;

  className?: string;

  /**
   * Set active domain
   */
  onClick?: () => {};

  tabIndex: number;
}

interface ISidebar {
  /**
   * List of cookies by domain
   */
  cookiesByDomain: Array<ICookie>;

  activeDomain: string;
  setActiveDomain: (domain: string) => void;
  cookieFns: ICookieFns;
  setCollectionRef: object;
}
