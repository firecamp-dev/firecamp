// @ts-nocheck
import { FC, useMemo } from 'react';

import { CopyButton, ConfirmationPopover } from '@firecamp/ui-kit';
import { ICookie } from '@firecamp/types';
import AddCookie from '../add-cookie/AddCookie';

import Constants from '../Constants';
import { ICookieFns } from '../CookieManager';

const { COOKIE_PARAMS } = Constants;

const Cookie: FC<ICookieComp> = ({ cookie = {}, cookieFns = () => {} }) => {
  // console.log(`cookie`, cookie);

  let cookieJSON = useMemo(() => {
    // return F.cookieManager.cookieToJSON(cookie.raw);
  }, [cookie]);
  let cookieString = useMemo(() => {
    // return F.cookieManager.cookieToString(cookie.raw);
  }, [cookie]);

  // console.log(`cookieJSON`, cookieJSON);

  return (
    <div className="fc-cookie-list-item" key={cookie._meta.id || ''}>
      <div className="fc-cookie-list-item-action">
        <AddCookie
          popoverID={`update-cookie-from-cookie-card-${cookie._meta.id}`}
          mutation={true}
          cookie={Object.assign({}, cookieJSON, {
            _meta: { id: cookie._meta.id || '' },
          })}
          cookieFns={cookieFns}
        />

        <ConfirmationPopover
          id={`remove-cookie-${cookie._meta.id}`}
          handler={<span className="iconv2-delete-v2-icon"></span>}
          title="Are you sure remove?"
          _meta={{
            showDeleteIcon: false,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            tooltip: '',
          }}
          onConfirm={(_) => cookieFns.remove(cookie)}
        />
      </div>
      {COOKIE_PARAMS.map((param, index) => {
        return (
          <div key={index} className="fc-cookie-params">
            <label>{param.name || ''}:</label>
            <span>
              {param.id === 'httpOnly' || param.id === 'secure'
                ? cookieJSON[param.id] === true
                  ? 'true'
                  : 'false'
                : cookieJSON[param.id]}
            </span>
          </div>
        );
      })}
      <div className="fc-cookie-string">
        <div className="fc-cookie">{cookieString || ''}</div>
        <CopyButton
          id={`copy-button-${cookie._meta.id || ''}`}
          text={cookieString || ''}
        />
      </div>
    </div>
  );
};
export default Cookie;

interface ICookieComp {
  cookie: ICookie;
  cookieFns: ICookieFns;
}
