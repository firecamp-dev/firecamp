import { FC, useState, useEffect, useRef } from 'react';
import equal from 'deep-equal';
import { nanoid as id } from 'nanoid';
import {
  Button,
 
  
  Popover,
  EPopoverPosition,
} from '@firecamp/ui-kit';
import DomainList, { DomainBody } from './DomainList';
import {
  preferenceStore,
  Preferences,
} from '../../../../store/-bk_preferences';
import '../SSLnProxyManager.sass';
import CONSTS from './Constants';
import { Name, PreferenceMisc } from '../../../../constants/preferences';
import { _object } from '@firecamp/utils';

const { DUMMY_SSL } = CONSTS;

const enable_sync_certificate_path_key = 'sync';

const SSLManager: FC<any> = () => {
  // Fetch initial state
  const certRef = useRef(preferenceStore.getState()[Name.CERTIFICATES]);

  let certificates = certRef.current.filter(
    (c) => c?.__meta?.type === PreferenceMisc.SSL
  );

  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      preferenceStore.subscribe(
        (cert) => {
          certRef.current = cert;
          setSSLList(cert);
          certificates = cert;
        },
        (state) => state[Name.CERTIFICATES]
      ),
    []
  );

  let [sslList, setSSLList] = useState([]);

  useEffect(() => {
    if (!equal(sslList, certificates)) {
      setSSLList(certificates);
    }
  }, [certRef.current]);

  let sslListFns = {
    add: async (sslData = {}) => {
      let addPayload = Object.assign({}, DUMMY_SSL, {
        meta: Object.assign({}, DUMMY_SSL.__meta, sslData),
        _meta: Object.assign({}, DUMMY_SSL.__ref, {
          id: id(),
          createdAt: new Date().valueOf(),
          // createdBy: F.userMeta.id
        }),
      });

      await Preferences.addCertificate(addPayload, true);
    },
    update: (sslId = '', payload = {}) => {
      let updateIndex = sslList.findIndex(
        (lc) => lc.__ref && lc.__ref.id === sslId
      );
      if (updateIndex !== -1) {
        let updatedSSL = Object.assign({}, sslList[updateIndex], {
          meta: Object.assign({}, sslList[updateIndex].__meta, payload),
        });
        let updatePayload = [
          ...sslList.slice(0, updateIndex),
          updatedSSL,
          ...sslList.slice(updateIndex + 1),
        ];
        setSSLList(updatePayload);
        if (_object.has(payload, 'disable')) {
          sslListFns.save(sslId, updatedSSL);
        }
      }
    },
    remove: async (sslId = '') => {
      let _meta = {
        id: sslId,
        deleted_at: new Date().valueOf(),
        // deleted_by: F.userMeta.id
      };

      await Preferences.removeCertificate(_meta, true);
    },
    save: async (sslId = '', updatedSSL = {}) => {
      let updateIndex = sslList.findIndex(
        (lc) => lc.__ref && lc.__ref.id === sslId
      );

      if (updateIndex !== -1) {
        let sslData = _object.size(updatedSSL)
          ? updatedSSL
          : sslList[updateIndex];

        console.log({ sslData });
        await Preferences.updateCertificate(sslData, true);
      }
    },
  };

  return [
    <div className="fc-ssl-search-wrapper" key="controls">
      {sslList && sslList.length ? (
        <AddSSLPopover onAdd={sslListFns.add} sslList={sslList} />
      ) : (
        ''
      )}
    </div>,
    sslList && sslList.length ? (
      <DomainList
        key="domainList"
        list={sslList}
        sslList={certificates}
        domainFns={sslListFns}
      />
    ) : (
      <div className="ssl-empty" key="ssl-empty">
        <span>You haven't added any SSL yet</span>
        {<AddSSLPopover onAdd={sslListFns.add} sslList={sslList} />}
      </div>
    ),
  ];
};
export default SSLManager;

const AddSSLPopover: FC<any> = ({ sslList = [], onAdd = () => {} }) => {
  let [addSSLData, setAddSSLData] = useState({
    host: '',
    file_path: '',
    [enable_sync_certificate_path_key]: false,
  });
  let [isAddSslOpen, toggleSslOpen] = useState(false);
  let [addSSLError, setAddSSLError] = useState('');

  let _onChangeAddSSLData = (key = '', value = '') => {
    if (!key) return;

    if (key === 'host') {
      if (addSSLError.length) {
        setAddSSLError('');
      }
      value = value.trim();
    }
    setAddSSLData({
      ...addSSLData,
      [key]: value,
    });
  };

  let _onAddNewSSL = () => {
    // console.log(`in add`);

    try {
      let found = sslList.find(
        (ssl) =>
          ssl.__meta &&
          ssl.__meta.host.toLowerCase() === addSSLData.host.toLowerCase()
      );
      if (found) {
        setAddSSLError(`Certificate for this host is already set.`);
        return;
      }

      if (!addSSLData.host || !addSSLData.host.trim()) {
        setAddSSLError(`Host for certificate is compulsory`);
        return;
      }

      if (!addSSLData.file_path || !addSSLData.file_path.trim()) {
        setAddSSLError(`Certificate is compulsory`);
        return;
      }
    } catch (e) {
      console.log(`e`, e);
    }
    onAdd(addSSLData);
    _setPopupToInit();
  };

  let _setPopupToInit = (toggle = true) => {
    if (toggle) {
      toggleSslOpen(!isAddSslOpen);
    }
    setAddSSLData({
      host: '',
      file_path: '',
      [enable_sync_certificate_path_key]: false,
    });
    setAddSSLError('');
  };

  return (
    <Popover
      key="body"
      isOpen={isAddSslOpen}
      detach={false}
      onToggleOpen={(value) => {
        toggleSslOpen(value);
        if (!value) {
          _setPopupToInit(false);
        }
      }}
      content={
        isAddSslOpen ? (
          <div className="p-2">
            <DomainBody
              host={addSSLData.host || ''}
              file_path={addSSLData.file_path || ''}
              sync={addSSLData[enable_sync_certificate_path_key] || false}
              onChange={_onChangeAddSSLData}
            />
            {addSSLError && addSSLError.length ? (
              <div className="text-xs font-light text-error">
                {addSSLError || ''}
              </div>
            ) : (
              ''
            )}

            <div className="flex justify-end">
              <Button
                text="Add"
                primary
                sm
                className="w-full"
                onClick={_onAddNewSSL}
              />
            </div>
          </div>
        ) : (
          ''
        )
      }
    >
      <Popover.Handler id={'sslmanager'}>
        <Button
          text="Add Domain"
          primary
          sm
          // TODO: add className="btn-fullwidth small font-light"
        />
      </Popover.Handler>
    </Popover>
  );
};
