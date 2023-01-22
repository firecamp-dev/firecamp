import { FC, useState, useEffect } from 'react';
import isEqual from 'react-fast-compare';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import {
  Container,
  TabHeader,
  Button,
  Input,
  Popover,
} from '@firecamp/ui-kit';
import { ICookie } from '@firecamp/types';
import { _date } from '@firecamp/utils';
import Constants from '../Constants';
import { ICookieFns } from '../CookieManager';

const { COOKIE_PARAMS } = Constants;

const AddCookie: FC<IAddCookie> = ({
  popoverID = '',
  cookie: propCookie = {},
  mutation = false,
  cookieFns = {},
}) => {
  let [cookieElements, setCookieElements] = useState({});
  let [cookieErrorMsg, setCookieErrorMsg] = useState('');
  let [isAddCookieOpen, toggleCookieOpen] = useState(false);

  useEffect(() => {
    if (isAddCookieOpen) {
      _resetCookies();
    }
  }, [propCookie?.__ref?.id, isAddCookieOpen]);

  let _resetCookies = () => {
    // console.log(`propCookie`, propCookie);
    let newCookieState = {};
    COOKIE_PARAMS.map((element, index) => {
      newCookieState = Object.assign({}, newCookieState, {
        [element.id]: Object.assign({}, element, {
          value:
            mutation === true
              ? element.type === 'text'
                ? propCookie[element.id] || ''
                : propCookie[element.id] === undefined
                ? false
                : propCookie[element.id]
              : element.type === 'text'
              ? ''
              : false,
        }),
      });
    });
    // console.log(`newCookieState`, newCookieState);
    setCookieElements(newCookieState);
  };

  let _handleInputChange = (event) => {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setCookieElements((cookieEle) => {
      return Object.assign({}, cookieEle, {
        [name]: Object.assign({}, cookieEle[name], { value }),
      });
    });
    if (cookieErrorMsg.length) {
      setCookieErrorMsg('');
    }
  };

  let _onClickSubmit = async (e) => {
    if (e) e.preventDefault();
    if (cookieErrorMsg.length) {
      return;
    }

    let result = {},
      emptyKeys = [];

    (Object.values(cookieElements) || []).map((ele) => {
      if (ele.id === 'key' || ele.id === 'domain' || ele.id === 'path') {
        if (
          !cookieElements[ele.id]['value'] ||
          !cookieElements[ele.id]['value'].trim()
        ) {
          emptyKeys.push(ele.id);
        }
      }
      result = Object.assign({}, result, {
        [ele.id]: cookieElements[ele.id]['value'],
      });
    });

    if (emptyKeys.length) {
      setCookieErrorMsg(`Please check ${emptyKeys.join(',')} can not be empty`);
      return;
    }

    if (!result) return;
    if (result['expires']) {
      let date = _date.toDate(result['expires']);
      let isValid = _date.isValidDate(date);
      if (isValid) {
        result['expires'] = date;
      } else {
        setCookieErrorMsg('Invalid Expires Value');
        return;
      }
    }

    if (mutation === true) {
      // console.log(`UPDATED result`, result);
      let updatedElements = [];
      COOKIE_PARAMS.map((element, index) => {
        if (!isEqual(propCookie[element.id], cookieElements[element.id])) {
          updatedElements.push(element.id);
        }
      });

      if (updatedElements.length) {
        let checkIfExist = false;
        if (
          updatedElements.includes('key') ||
          updatedElements.includes('domain') ||
          updatedElements.includes('path')
        ) {
          checkIfExist = true;
        }
        await cookieFns
          .update(
            Object.assign({}, result, {
              id: propCookie?.__ref?.id || '',
            }),
            checkIfExist
          )
          .then((flag) => {
            if (flag === false) {
              setCookieErrorMsg('Cookie already exist');
            } else {
              toggleCookieOpen(false);
              setCookieElements({});
              setCookieErrorMsg('');
            }
          });
      }
    } else {
      // console.log(`Added result`, result);
      await cookieFns.add(result).then((flag) => {
        if (flag === false) {
          setCookieErrorMsg('Cookie already exist');
        } else {
          toggleCookieOpen(false);
          setCookieElements({});
          setCookieErrorMsg('');
        }
      });
    }
  };

  let _onClickCancel = (e) => {
    // console.log(`in close`);
    if (e) e.preventDefault();
    toggleCookieOpen(false);
    // console.log(`_onClickCancel`);
  };

  return (
    <Popover
      detach={false}
      isOpen={isAddCookieOpen}
      onToggleOpen={toggleCookieOpen}
      content={
        <div className="p-2 w-56">
          <div>
            <Container>
              <Container.Header className="text-sm font-bold mb-1 text-appForeground opacity-70">
                {mutation === true ? `Update cookie` : `Add cookie`}
              </Container.Header>
              <Container.Body>
                {(Object.values(cookieElements) || []).map((ele, index) => {
                  // console.log(`ele`, ele);
                  if (ele.type === 'text') {
                    return (
                      <Input
                        autoFocus={index === 0}
                        key={index}
                        label={ele['name'] || ''}
                        name={ele['id']}
                        value={ele['value']}
                        onChange={_handleInputChange}
                        error={ele['errorMsg']}
                        wrapperClassName="flex-col items-baseline mb-2"
                      />
                    );
                  } else if (ele.type === 'boolean') {
                    return (
                      <div className="flex mt-2 items-center" key={index}>
                        <label className="!mb-0">{ele['name'] || ''}</label>
                        <div className="toggleWrapper small">
                          <input
                            className="switch"
                            type="checkbox"
                            name={ele['id']}
                            id={ele['id']}
                            checked={ele['value']}
                            onChange={_handleInputChange}
                          />

                          <label htmlFor={ele['id']} className="toggle">
                            <span className="toggle__handler" />
                          </label>
                        </div>
                      </div>
                    );
                  }
                })}
              </Container.Body>
              <Container.Footer>
                <TabHeader className="p-0">
                  {cookieErrorMsg && cookieErrorMsg.length ? (
                    <TabHeader.Center>
                      <div className={'fc-error'}>{cookieErrorMsg}</div>
                    </TabHeader.Center>
                  ) : (
                    <TabHeader.Right>
                      <Button
                        text="Cancel"
                        secondary
                        transparent={true}
                        sm
                        onClick={_onClickCancel}
                      />
                      <Button
                        text={mutation === true ? 'Update' : 'Add'}
                        primary
                        sm
                        onClick={_onClickSubmit}
                      />
                    </TabHeader.Right>
                  )}
                </TabHeader>
              </Container.Footer>
            </Container>
          </div>
        </div>
      }
    >
      <Popover.Handler id={popoverID}>
        {mutation === true ? (
          <span className="iconv2-edit-icon"></span>
        ) : (
          <Button
            // TODO: add color="primary-alt"
            primary
            sm
            iconLeft
            text="Add Cookie"
            icon={<VscAdd className="ml-2 toggle-arrow" size={12} />}
          />
        )}
      </Popover.Handler>
    </Popover>
  );
};

export default AddCookie;

interface IAddCookie {
  /**
   * Add cookie poover unique identification
   */
  popoverID: string;

  /**
   * Cookie object
   */
  cookie: ICookie;

  /**
   * A boolean value states if cookie updated/ modified or not
   */
  mutation: boolean;

  cookieFns: ICookieFns;
}
