// @ts-nocheck
import { FC, useState, useRef, useEffect } from 'react';

import classnames from 'classnames';
import equal from 'deep-equal';
import {
  Input,
  FileInput,
  SwitchButton,
  Checkbox,
  ConfirmationPopover,
} from '@firecamp/ui-kit';
import { bool } from 'prop-types';

const DomainList: FC<IDomainList> = ({
  sslList = [],
  list = [],
  domainFns = {},
}) => {
  return list.length ? (
    <div className="fc-ssl-domain-list">
      {list.map((domain, i) => {
        let ssl = sslList.find(
          (lc) => lc._meta && domain._meta && lc._meta.id === domain._meta.id
        );
        return (
          <DomainItem
            key={domain._meta ? domain._meta.id : ''}
            isUpdated={ssl && !equal(ssl.meta, domain.meta)}
            sslList={sslList}
            domain={domain}
            domainFns={domainFns}
          />
        );
      })}
    </div>
  ) : (
    ''
  );
};

const DomainItem: FC<IDomainItem> = ({
  isUpdated = false,
  sslList = {},
  domain = {},
  domainFns = {},
}) => {
  let switchRef = useRef();
  let {
    _meta: { id },
    meta: { host = '', file_path = '', disable = false, sync = false },
  } = domain;
  let { save, remove } = domainFns;

  let [isCollapsed, toggleCollapse] = useState(false);
  let [errorMsg, setErrorMsg] = useState('');

  let _onSave = (id = '') => {
    try {
      let found = sslList.find(
        (ssl) =>
          ssl.meta &&
          ssl._meta &&
          ssl._meta.id !== id &&
          (ssl.meta.host.toLowerCase() || '').trim() ===
            (host.toLowerCase() || '').trim()
      );
      if (found) {
        setErrorMsg(`Certificate for this host is already set.`);
        return;
      }

      if (!host || !host.trim()) {
        setErrorMsg(`Host for certificate is compulsory`);
        return;
      }

      if (!file_path || !file_path.trim()) {
        setErrorMsg(`Certificate is compulsory`);
        return;
      }
    } catch (e) {
      console.log(`e`, e);
    }
    save(id);
  };

  return (
    <div
      key={id}
      className={classnames({ active: isCollapsed }, 'fc-collapse')}
    >
      <div
        id={`header-${id}`}
        className="fc-collapse-head"
        onClick={(e) => {
          // if event propogates from switch then ignore toggle
          if (switchRef.current.contains(e.target)) return;
          toggleCollapse(!isCollapsed);
        }}
      >
        <div className="fc-collapse-head-arrow" />
        <span>{host || ''}</span>

        <div className="fc-ssl-domain-list-item-head-switch" ref={switchRef}>
          <SwitchButton
            id={id}
            checked={disable}
            onChange={(value) => {
              domainFns.update(id, { ['disable']: value });
            }}
          />
        </div>
      </div>
      {isCollapsed ? (
        <div className="fc-collapse-body">
          <DomainControls
            id={id}
            isUpdated={isUpdated}
            onSave={() => _onSave(id)}
            onRemove={() => remove(id)}
          />
          <DomainBody
            host={host || ''}
            file_path={file_path || ''}
            sync={sync || false}
            errorMsg={errorMsg}
            onChange={(key, value) => {
              if (errorMsg !== '') {
                setErrorMsg('');
              }
              domainFns.update(id, { [key]: value });
            }}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const DomainControls: FC<IDomainControls> = ({
  id = '',
  isUpdated = false,
  onSave = () => {},
  onRemove = () => {},
}) => {
  return (
    <div className="fc-collapse-body-action">
      {isUpdated ? (
        <div
          className="fc-collapse-body-action-save icon-Add-req"
          onClick={onSave}
        />
      ) : (
        ''
      )}
      <ConfirmationPopover
        key={`remove-ssl-${id}`}
        id={`remove-ssl-${id}`}
        handler={<div className="fc-collapse-body-action-delete icon-delete" />}
        title="Are you sure remove?"
        _meta={{
          showDeleteIcon: false,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          tooltip: '',
        }}
        onConfirm={onRemove}
      />
    </div>
  );
};

const DomainBody: FC<IDomainBody> = ({
  formgroupClassname = '',
  host = '',
  file_path = '',
  sync = false,
  errorMsg = '',
  onChange = () => {},
}) => {
  let _onChangeDomain = (e) => {
    if (e) e.preventDefault();

    let { value } = e.target;

    value = value.trim();
    onChange('host', value);
  };

  let _onSelectFile = (e) => {
    let target = e.target;
    let file = target.files[0];
    if (file && file.path && file.path.length) {
      onChange('file_path', file.path);
    }
  };

  // console.log(`file_path`, file_path);

  return (
    <form
      className="fc-form grid max-w-sm"
      onSubmit={(e) => {
        e && e.preventDefault();
      }}
    >
      <Input
        autoFocus={true}
        name="host"
        placeholder="domain:port_number"
        className="fc-input bg-appBackground2 small"
        value={host || ''}
        onChange={_onChangeDomain}
        label="Host:"
      />
      <div
        className={classnames(
          'fc-form-group  form-group relative',
          formgroupClassname
        )}
      >
        <label>Select Certificate:</label>
        <FileInput
          ButtonText="Select Certificate"
          path={file_path}
          onSelectFile={_onSelectFile}
        />
      </div>
      <Checkbox
        isChecked={sync}
        checkboxFor={'Sync certificate path'}
        tabIndex={0}
        onToggleCheck={() => onChange('sync', !sync)}
        label="Select certificate path"
      />
      <div className="fc-error">{errorMsg}</div>
    </form>
  );
};

export default DomainList;
export { DomainBody, DomainControls };

interface IDomainList {
  sslList: any[]; // [] //todo: define a proper type here
  list: any[]; // [] //todo: define a proper type here
  domainFns: any; // {}
}

interface IDomainItem {
  isUpdated: boolean;
  sslList: any; // {}
  domain: any; // {},
  domainFns: any; //{}   //todo: define a proper type here
}

interface IDomainControls {
  id: string;
  isUpdated: boolean;
  onSave: Function;
  onRemove: Function;
}

interface IDomainBody {
  formgroupClassname: string;
  host: string;
  file_path: string;
  sync: boolean;
  errorMsg: string;
  onUpdate: Function;
}
