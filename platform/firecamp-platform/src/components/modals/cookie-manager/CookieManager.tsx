import { FC, useEffect, useRef, useState } from 'react';
import { nanoid as id } from 'nanoid';
import { AvailableOnElectron, Modal, Row } from '@firecamp/ui';
import { _array, _misc, _object } from '@firecamp/utils';
import { EFirecampAgent } from '@firecamp/types';
import Sidebar from './sidebar/Sidebar';
import Body from './body/Body';
import AddCookie from './add-cookie/AddCookie';
import './CookieManager.sass';

const CookieManager: FC<ICookieManager> = ({
  isOpen = false,
  activeDomain: propsActiveDomain = '',
  onClose = () => {},
}) => {
  let [cookiesByDomain, setCookiesByDomain] = useState({});
  let [activeDomain, setActiveDomain] = useState(propsActiveDomain);

  let collection_Ref = useRef(null);

  // const cookieManager_Instance = F.cookieManager;

  useEffect(() => {
    if (_misc.firecampAgent() === EFirecampAgent.Desktop) {
      let _setCookiesByDomain = async (domain = '') => {
        // let fetchedCookiesByDomain = /*dummyCookies;*/ await F.db.cookie.fetchAllByDomain(
        //   domain
        // );
        // console.log(`fetchedCookiesByDomain`, fetchedCookiesByDomain);
        // setCookiesByDomain(fetchedCookiesByDomain);
        // if (domain.length) {
        //   _setActiveDomain(domain);
        // } else if (
        //   fetchedCookiesByDomain &&
        //   _object.size(fetchedCookiesByDomain)
        // ) {
        //   _setActiveDomain(Object.keys(fetchedCookiesByDomain)[0]);
        // }
      };
      _setCookiesByDomain(activeDomain);
    }
  }, [activeDomain]);

  let _stateCookieFns = {
    add: (cookie = {}) => {
      if (!activeDomain || !_object.size(cookiesByDomain)) {
        setCookiesByDomain(Object.assign({}, { [cookie.domain]: [cookie] }));
      } else {
        setCookiesByDomain((existingCookiesByDomain) => {
          return Object.assign({}, existingCookiesByDomain, {
            [cookie.domain]: (
              existingCookiesByDomain[cookie.domain] || []
            ).concat(cookie),
          });
        });
      }

      _setActiveDomain(cookie.domain);
    },
    update: (cookie = {}) => {
      let existingCookies = cookiesByDomain[activeDomain];
      let cookieIndex = (existingCookies || []).findIndex(
        (c) => c.__ref.id === cookie.__ref.id
      );
      // console.log(`cookie`, cookieIndex, cookie);
      if (cookieIndex !== -1) {
        let result = Object.assign({}, cookiesByDomain, {
          [activeDomain]: [
            ...cookiesByDomain[activeDomain].slice(0, cookieIndex),
            Object.assign(
              {},
              cookiesByDomain[activeDomain][cookieIndex],
              cookie
            ),
            ...cookiesByDomain[activeDomain].slice(cookieIndex + 1),
          ],
        });
        // console.log(`result`, result);
        setCookiesByDomain(result);
        _setActiveDomain(cookie.domain);
      }
    },
    remove: (cookieId = '') => {
      setCookiesByDomain((existingCookiesByDomain) => {
        let existingCookies = existingCookiesByDomain[activeDomain];
        let cookieIndex = (existingCookies || []).findIndex(
          (c) => c.__ref.id === cookieId
        );
        if (cookieIndex !== -1) {
          let cookies = [
            ...existingCookiesByDomain[activeDomain].slice(0, cookieIndex),
            ...existingCookiesByDomain[activeDomain].slice(cookieIndex + 1),
          ];
          return Object.assign({}, existingCookiesByDomain, {
            [activeDomain]: cookies,
          });
        } else {
          return existingCookiesByDomain;
        }
      });
    },
    removeAllByDomain: (domain = '') => {
      let updated = Object.assign({}, _object.omit(cookiesByDomain, [domain]));
      if (updated && _object.size(updated)) {
        _setActiveDomain(Object.keys(updated)[0]);
      } else {
        _setActiveDomain('');
      }
      setCookiesByDomain(updated);
    },
  };

  let _cookieFns = {
    fetchCookieByIndex: async (cookie = {}) => {
      // return await F.db.cookie.fetchByIndex(cookie);
    },
    add: async (cookie = {}) => {
      let parsedCookie;

      try {
        // Parse cookie by tough-cookie
        parsedCookie = cookieManager_Instance.parse(cookie);

        if (parsedCookie && typeof parsedCookie === 'object') {
          for (let key in parsedCookie) {
            if (parsedCookie[key] === null) {
              parsedCookie[key] = '';
            }
          }
        }

        // Check if cookie is exist
        const oldCookie = await _cookieFns.fetchCookieByIndex(parsedCookie);

        // Prevent
        if (oldCookie && !_array.isEmpty(oldCookie)) {
          return Promise.resolve(false);
        } else {
          // Add cookie in cookie jar
          await cookieManager_Instance.addCookie(parsedCookie);

          parsedCookie = Object.assign({}, parsedCookie, {
            __ref: {
              id: id(),
            },
          });

          // Add cookie into DB
          // await F.db.cookie.add(parsedCookie);

          // Add cookie into react state
          await _stateCookieFns.add(parsedCookie);

          if (activeDomain !== cookie.domain) {
            _setActiveDomain(cookie.domain);
          }

          return Promise.resolve(parsedCookie.__ref.id);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    update: async (cookie = {}, checkIfExist = false) => {
      try {
        // Parse cookie using tough-cookie
        let parsedCookie = cookieManager_Instance.parse(
          _object.omit(cookie, ['id'])
        );

        // console.log(`parsedCookie`, parsedCookie);

        if (parsedCookie) {
          for (let key in parsedCookie) {
            if (parsedCookie[key] === null) {
              parsedCookie[key] = '';
            }
          }
        }

        let _update = async () => {
          // console.log({ cookiesByDomain, cookie, activeDomain });

          let existingCookie =
            cookiesByDomain[activeDomain].find(
              (c) => c.__ref.id === cookie.id
            ) || {};

          // console.log({ existingCookie });

          // Fetch old cookie
          const oldCookie = await cookieManager_Instance.getCookie(
            existingCookie.domain,
            existingCookie.path,
            existingCookie.key
          );

          // console.log({ oldCookie, parsedCookie });

          // Update cookie in cookie jar
          await cookieManager_Instance.updateCookie(oldCookie, parsedCookie);

          parsedCookie = Object.assign({}, parsedCookie, {
            __ref: { id: cookie.id },
          });

          // Update cookie in DB
          // await F.db.cookie.update(cookie.id, parsedCookie);

          // Update cookie in react state
          await _stateCookieFns.update(parsedCookie);

          return Promise.resolve();
        };

        if (checkIfExist) {
          try {
            // Check if cookie is exist
            const cookieFromDB = await _cookieFns.fetchCookieByIndex(
              parsedCookie
            );

            if (cookieFromDB && !_array.isEmpty(cookieFromDB)) {
              return Promise.resolve(false);
            } else {
              await _update();

              return Promise.resolve(cookie.id);
            }
          } catch (error) {
            console.error({
              API: 'CookieManager.update',
              args: {
                cookie,
                checkIfExist,
              },
              error,
            });
          }
        } else {
          await _update();
          return Promise.resolve(cookie.id);
        }
      } catch (error) {
        console.error({
          API: 'CookieManager.update',
          args: {
            cookie,
            checkIfExist,
          },
        });

        return Promise.reject(error);
      }
    },
    remove: async (cookie = {}) => {
      if (
        activeDomain &&
        cookiesByDomain &&
        cookiesByDomain[cookie.domain] &&
        cookiesByDomain[cookie.domain].length === 1
      ) {
        _cookieFns.removeAllByDomain(cookie.domain);
      } else {
        //Remove from JAR
        await cookieManager_Instance.removeCookie(
          cookie.domain,
          cookie.path,
          cookie.key
        );

        let __ref = {
          id: cookie.__ref.id,
        };

        //Remove from DB
        // await F.db.cookie.remove(__ref);

        //Remove from state
        _stateCookieFns.remove(cookie.__ref.id);
      }
    },
    removeAllByDomain: async (domain = '') => {
      // console.log(`Domain to remove all cookies by domain`, domain);

      if (!domain || !domain.length) {
        domain = activeDomain;
      }

      //Remove all cookies from JAR by domain
      await cookieManager_Instance.removeCookies(domain);

      //Remove all cookies from DB by domain
      // await F.db.cookie.removeByDomain(domain)

      //Remove all cookies from state by domain
      _stateCookieFns.removeAllByDomain(domain);
    },
  };

  let _setActiveDomain = (domain = '') => {
    if (domain !== activeDomain) {
      setActiveDomain(domain);
      if (collection_Ref.current) {
        collection_Ref.current._clearSelections();
        collection_Ref.current._setSelection([domain]);
        collection_Ref.current._focus(domain);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="setting-modal">
      <Modal.Header className="fc-modal-head">
        <span className="icv2-cookie-icon"></span>
        Cookie Manager
      </Modal.Header>
      <Modal.Body>
        {_misc.firecampAgent() === EFirecampAgent.Desktop ? (
          activeDomain && cookiesByDomain && cookiesByDomain[activeDomain] ? (
            <Row className="w-full with-divider">
              <Sidebar
                cookiesByDomain={cookiesByDomain}
                activeDomain={activeDomain}
                setActiveDomain={_setActiveDomain}
                cookieFns={_cookieFns}
                setCollectionRef={collection_Ref}
              />
              <Body
                domain={{
                  name: activeDomain,
                  cookies: cookiesByDomain[activeDomain] || [],
                }}
                cookieFns={_cookieFns}
              />
            </Row>
          ) : (
            <Row className="w-full with-divider">
              <div className="p-4 add-cookie-empty">
                <AddCookie
                  popoverID={`add-cookie-from-cookie-manager`}
                  cookieFns={_cookieFns}
                />
                <div className="fc-notes">
                  You haven't added any cookie yet.
                </div>
              </div>
            </Row>
          )
        ) : (
          <AvailableOnElectron name={'Cookie manager'} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CookieManager;

interface ICookieManager {
  /**
   * A boolean value states that modal is open or not
   */
  isOpen: boolean;

  /**
   * States active domain from all grouped cookies by domain
   */
  activeDomain: string;

  /**
   * close cookie manager modal
   */
  onClose: () => void;
}

/**
 * Manage cookie functions
 */
export interface ICookieFns {
  /**
   * Fetch cookie by cookie index
   */
  fetchCookieByIndex: (cookie: object) => Promise<any>;

  /**
   * Add cookie in state, appStore, and db
   */
  add: (cookie: object) => Promise<any>;

  /**
   * Update cookie in state, appStore, and db
   */
  update: (cookie: object, checkIfExist: boolean) => Promise<any>;

  /**
   * Remove cookie from state, appStore, and db
   */
  remove: (cookie: object) => void;

  /**
   * Add all cookies from state, appStore, and db
   */
  removeAllByDomain: (domain: string) => void;
}
