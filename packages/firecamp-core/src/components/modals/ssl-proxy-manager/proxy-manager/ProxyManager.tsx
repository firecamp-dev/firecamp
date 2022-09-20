import { FC, useState, useEffect, useRef } from 'react';
import equal from 'deep-equal';
import { nanoid as id } from 'nanoid';
import { Button, EButtonColor, EButtonSize, Popover } from '@firecamp/ui-kit';

import DomainList, { DomainBody } from './DomainList';

import {
  preferenceStore,
  Preferences,
} from '../../../../store/-bk_preferences';
import { Preferences as _Preferences } from '../../../../constants';
import '../SSLnProxyManager.sass';
import { _array, _object } from '@firecamp/utils';

const ProxyManager: FC<any> = () => {
  let [proxyData, setProxyData] = useState([]);
  let [initialState, setInitialState] = useState([]);

  const { Name } = _Preferences;
  // Fetch initial state
  const proxyRef = useRef(preferenceStore.getState()[Name.PROXIES]);

  let _generateProxyPayload = (proxy = []) => {
    let proxyPayload = proxy.map((s) => {
      // FC-v2.1: 'id' will be from '_meta' key. If id not found, return
      if (!s._meta || (s._meta && !s._meta.id)) return [];

      let index = proxyData.findIndex(
        (i) => i._meta && i._meta.id === s._meta.id
      );

      // console.log(`proxyData`, proxyData, index)

      s = Object.assign({}, s, {
        set_for: s.set_for.join('\n'),
        no_proxy: s.no_proxy.join('\n'),
      });
      if (index !== -1) {
        // console.log(`proxyData[index].isCollapsed `, proxyData[index].isCollapsed)
        return Object.assign({}, s, {
          isCollapsed: proxyData[index].isCollapsed || false,
          isUpdated: false,
        });
      } else {
        return Object.assign({}, s, {
          isCollapsed: false,
          isUpdated: false,
        });
      }
    });
    return proxyPayload || [];
  };

  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      preferenceStore.subscribe(
        (proxy) => {
          proxyRef.current = proxy;
          let proxiesToSet = _generateProxyPayload(Array.from(proxy));
          // console.log({ proxiesToSet, proxyData });
          if (!equal(proxiesToSet, proxyData)) {
            setProxyData(proxiesToSet);
            setInitialState(proxiesToSet);
          }
        },
        (state) => state[Name.PROXIES]
      ),
    []
  );

  useEffect(() => {
    if (proxyRef.current) {
      let proxiesToSet = _generateProxyPayload(Array.from(proxyRef.current));
      if (!equal(proxiesToSet, proxyData)) {
        setProxyData(proxiesToSet);
        setInitialState(proxiesToSet);
      }
    }
  }, []);

  let domainFns = {
    toggleCollapse: (id = '') => {
      if (!id) return;

      let index = proxyData.findIndex((d) => d._meta && d._meta.id === id);

      if (index === -1 || !proxyData[index]) return;

      if (!proxyData[index]) return;

      let newData = [
        ...proxyData.slice(0, index),
        {
          ...proxyData[index],
          isCollapsed: !proxyData[index].isCollapsed,
        },
        ...proxyData.slice(index + 1),
      ];

      // console.log(`newData collapse`, newData);
      setProxyData(newData);
    },
    add: async (payload = {}) => {
      // FC-v2.1: id will be in '_meta` key
      let addPayload = Object.assign({}, payload, {
        _meta: {
          id: id(),
          created_at: new Date().valueOf(),
          // created_by: F.userMeta.id,
        },
        disable: false,
        isCollapsed: false,
        isUpdated: false,
      });

      ['set_for', 'no_proxy'].map((key) => {
        if (_object.has(addPayload, key)) {
          let value = addPayload[key].split('\n') || [];
          value = _array.uniq(value);
          addPayload = Object.assign({}, addPayload, {
            [key]: value,
          });
        }
      });

      setProxyData([...proxyData, addPayload]);

      await Preferences.addProxy(
        _object.omit(addPayload, ['isCollapsed', 'isUpdated']),
        true
      );
    },
    edit: (id = '', updatedProxy = {}) => {
      if (!id || !updatedProxy) return;

      let index = proxyData.findIndex((d) => d._meta && d._meta.id === id);
      // console.log({ index, initialState, updatedProxy });
      if (index === -1 || !proxyData[index]) return;
      let proxyToUpdate = {
          ...proxyData[index],
          ...updatedProxy,
        },
        isUpdated = false;
      if (initialState) {
        if (initialState[index] || !initialState[index]) {
          isUpdated = !equal(
            _object.pick(initialState[index], Object.keys(updatedProxy)),
            updatedProxy
          );
          proxyToUpdate = {
            ...proxyToUpdate,
            isUpdated,
          };
        }
      }

      let newData = [
        ...proxyData.slice(0, index),
        proxyToUpdate,
        ...proxyData.slice(index + 1),
      ];
      setProxyData(newData);

      // console.log({ proxyToUpdate, newData, updatedProxy });
      if (_object.has(updatedProxy, 'disable')) {
        domainFns.save(proxyData[index]._meta.id, proxyToUpdate);
      }
    },
    save: async (id = '', proxyToUpdate = {}) => {
      let dataToSave = proxyToUpdate;

      if (_object.isEmpty(proxyToUpdate)) {
        let updatedProxy = proxyData.find((proxy) => proxy._meta.id === id);
        if (updatedProxy) {
          dataToSave = updatedProxy;
        }
      }

      ['set_for', 'no_proxy'].map((key) => {
        if (Object.hasKey(dataToSave, key)) {
          let value = dataToSave[key]?.split('\n') || [];
          value = _array.uniq(value);
          dataToSave = Object.assign({}, dataToSave, {
            [key]: value,
          });
        }
      });
      if (!_object.isEmpty(dataToSave)) {
        dataToSave['_meta'] = {
          id,
          updated_at: new Date().valueOf(),
          // updated_by: F.userMeta.id,
        };
        dataToSave = _object.omit(dataToSave, ['isCollapsed', 'isUpdated']);
        // console.log({ proxyUpdate: dataToSave });
        await Preferences.updateProxy(dataToSave, true);
      }
    },
    remove: async (id = '') => {
      let index = proxyData.findIndex((i) => i._meta.id === id);
      if (index === -1) return;
      let dataToSave = proxyData.map((i) => {
        return _object.omit(i, ['isCollapsed', 'isUpdated']);
      });

      dataToSave = [
        ...dataToSave.slice(0, index),
        ...dataToSave.slice(index + 1),
      ];

      setProxyData(dataToSave);
      await Preferences.removeProxy(
        {
          id,
          deleted_at: new Date().valueOf(),
          // deleted_by: F.userMeta.id,
        },
        true
      );
    },
  };

  return [
    <div className="fc-ssl-search-wrapper" key="controls">
      {proxyData && proxyData.length ? (
        <AddProxy proxyList={proxyData} onAdd={domainFns.add} />
      ) : (
        ''
      )}
    </div>,
    proxyData && proxyData.length ? (
      <DomainList key="domainList" list={proxyData} domainFns={domainFns} />
    ) : (
      <div key="empty_body" className="ssl-empty">
        <span>You haven't added any Proxy yet</span>
        {<AddProxy proxyList={proxyData} onAdd={domainFns.add} />}
      </div>
    ),
  ];
};
export default ProxyManager;

const AddProxy: FC<IAddProxy> = ({ proxyList = [], onAdd = () => {} }) => {
  let [addProxyData, setAddProxyData] = useState({
    url: '',
    no_proxy: '',
    set_for: '',
    reject_unauthorized: true,
  });

  let [isAddProxyOpen, toggleProxyOpen] = useState(false);
  let [addProxyError, setAddProxyError] = useState('');

  let _onUpdateAddProxyData = (key = '', value = '') => {
    if (!key) return;

    setAddProxyData({
      ...addProxyData,
      [key]: value,
    });
    if (key === 'url') {
      setAddProxyError('');
    }
  };

  let _onAddNewProxy = () => {
    try {
      let found = proxyList.find((proxy) => proxy.url === addProxyData.url);
      if (found) {
        setAddProxyError(`Proxy server with this host is already added.`);
        return;
      }
      if (!addProxyData.url || !addProxyData.url.trim()) {
        setAddProxyError(`URL is compulsory.`);
        return;
      }
      if (!addProxyData.set_for || !addProxyData.set_for.trim()) {
        setAddProxyError(`Setfor is compulsory.`);
        return;
      }
    } catch (e) {
      console.log(`e`, e);
    }

    onAdd(addProxyData);
    _setPopupToInit(true);
  };

  let _setPopupToInit = (toggle = true) => {
    if (toggle) {
      toggleProxyOpen(!isAddProxyOpen);
    }
    setAddProxyData({
      url: '',
      no_proxy: '',
      set_for: '',
      reject_unauthorized: false,
    });
    setAddProxyError('');
  };

  return (
    <Popover
      key="body"
      isOpen={isAddProxyOpen}
      detach={false}
      onToggleOpen={(value) => {
        if (!value) {
          _setPopupToInit(false);
        }
        toggleProxyOpen(value);
      }}
      content={
        <div className="p-2">
          <DomainBody
            url={addProxyData.url || ''}
            reject_unauthorized={addProxyData.reject_unauthorized || false}
            no_proxy={addProxyData.no_proxy || ''}
            set_for={addProxyData.set_for || ''}
            onUpdate={_onUpdateAddProxyData}
            formgroupClassname="position-relative form-group"
          />
          {addProxyError && addProxyError.length ? (
            <div className="text-xs font-light text-error">{addProxyError}</div>
          ) : (
            ''
          )}
          <div className="flex justify-end">
            <Button
              text="Add"
              color={EButtonColor.Primary}
              size={EButtonSize.Small}
              className="ml-auto"
              onClick={_onAddNewProxy}
            />
          </div>
        </div>
      }
    >
      <Popover.Handler id={'add-proxy-manager-popover'}>
        <Button
          text="Add Proxy"
          color={EButtonColor.Primary}
          size={EButtonSize.Small}
          // TODO: add className="font-light"
        />
      </Popover.Handler>
    </Popover>
  );
};

interface IAddProxy {
  proxyList: any[]; //todo: define a proper type here
  onAdd: Function;
}
