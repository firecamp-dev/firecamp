//@ts-nocheck
import { FC, useState, useEffect } from 'react';

import {
  Container,
  TabHeader,
  Button,
 
  
  CopyButton,
  Column,
  Input,
  Popover,
} from '@firecamp/ui';

import Cookie from './Cookie';
import { ICookie } from '@firecamp/types';

import { ICookieFns } from '../CookieManager';

const Body: FC<IBody> = ({
  domain = {
    name: '',
    cookies: [],
  },

  cookieFns = {
    add: () => {},
    update: () => {},
    remove: () => {},
    removeAllByDomain: () => {},
  },
}) => {
  let _clearAllCookies = (e) => {
    if (e) e.preventDefault();
    cookieFns.removeAllByDomain(domain.name);
  };

  return (
    <Container className="with-divider h-full">
      <Container.Header>
        <div className="text-lg leading-5 px-8 py-4 flex items-center font-medium">
          {domain.name || ''}
          {domain.cookies && domain.cookies.length ? (
            <span className="fc-setting-title-count">
              {domain.cookies.length}
            </span>
          ) : (
            ''
          )}
        </div>
      </Container.Header>
      <Container.Body>
        <div className="fc-cookie-list">
          {domain.cookies.map((cookie, i) => {
            return <Cookie key={i} cookie={cookie} cookieFns={cookieFns} />;
          })}
        </div>
      </Container.Body>
      <Container.Footer>
        <TabHeader>
          <TabHeader.Right>
            <ClearAllCookie
              domainName={domain.name}
              onClearAllCookie={_clearAllCookies}
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default Body;

interface IBody {
  /**
   * Cookie domain
   */
  domain: {
    name: string;
    cookies: Array<ICookie>;
  };

  cookieFns: ICookieFns;
}

const ClearAllCookie: FC<IClearAllCookie> = ({
  domainName = '',
  onClearAllCookie = () => {},
}) => {
  let [isOpen, toggleOpen] = useState(false);
  let [domainMeta, setDomainMeta] = useState({
    name: '',
    error: '',
  });

  useEffect(() => {
    if (isOpen === false) {
      setDomainMeta({
        name: '',
        error: '',
      });
    }
  }, [isOpen]);

  const _onInputHandleChange = (e) => {
    if (e) {
      e.preventDefault();
      let { value } = e.target;
      setDomainMeta({
        name: value || '',
        error: '',
      });
    }
  };

  const _onKeyDown = (e) => {
    if (e.key === 'Enter') {
      _onSubmit(e);
    }
  };

  const _onSubmit = (e) => {
    if (domainName.trim() === domainMeta.name.trim()) {
      onClearAllCookie(e);
      toggleOpen(false);
      setDomainMeta({
        name: '',
        error: '',
      });
    } else {
      setDomainMeta((ps) => {
        return {
          name: ps.name || '',
          error: 'Domain name mismatched!',
        };
      });
    }
  };

  const _onCancel = (e) => {
    toggleOpen(false);
  };

  return (
    <Popover
      detach={false}
      isOpen={isOpen}
      onToggleOpen={toggleOpen}
      content={
        <div className="p-2">
          <div>
            <div className="text-sm font-bold mb-1 text-appForegroundActive opacity-70">
              Clear All Cookies?
              <span className="text-sm font-light italic text-appForegroundActive opacity-70 block">{`Are you sure you want to delete all cookie from ${domainName}?`}</span>
              <div className="whitespace-pre overflow-hidden overflow-ellipsis flex ">
                {domainName || ''}
                <CopyButton
                  id={`copy-button-${domainName || ''}`}
                  text={domainName || ''}
                />
              </div>
            </div>
            <Input
              className="mb-2"
              placeholder="Confirm Domain Name"
              value={domainMeta.name || ''}
              onChange={_onInputHandleChange}
              onKeyDown={_onKeyDown}
              error={domainMeta.error || ''}
            />
            <div className="flex justify-end">
              <div className="flex ml-auto">
                <Button
                  text={'Cancel'}
                  secondary
                  sm
                  // TODO: add font-light
                  onClick={_onCancel}
                />

                <Button
                  text={'Delete'}
                  color="primary-alt"
                  sm
                  // TODO: add font-light
                  onClick={_onSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Popover.Handler id="clearallcookies">
        <Button
          primary
          transparent={true}
          ghost={true}
          sm
          text="Clear All Cookie"
        />
      </Popover.Handler>
    </Popover>
  );
};

interface IClearAllCookie {
  /**
   * Cookie domain name
   */
  domainName: string;

  /**
   * Remove all cookies
   */
  onClearAllCookie: () => void;
}
