// @ts-nocheck
import { FC, useState, useRef } from 'react';

import classnames from 'classnames';

import './SSLmanager.sass';
import {
  Input,
  SwitchButton,
  TextArea,
  Checkbox,
  ConfirmationPopover,
} from '@firecamp/ui-kit';

const DomainList: FC<IDomainList> = ({ list = [], domainFns = {} }) => {
  return list.length ? (
    <div className="fc-ssl-domain-list">
      {list.map((v, i) => {
        return (
          <DomainItem
            key={v.__ref ? v.__ref.id : ''}
            id={v.__ref ? v.__ref.id : ''}
            url={v.url}
            disable={v.disable}
            list={list}
            reject_unauthorized={v.reject_unauthorized}
            no_proxy={v.no_proxy}
            set_for={v.set_for}
            isCollapsed={v.isCollapsed}
            isUpdated={v.isUpdated}
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
  id = '',
  url = '',
  disable = false,
  reject_unauthorized = false,
  no_proxy = '',
  set_for = '',
  list = [],
  isCollapsed = false,
  isUpdated = false,

  domainFns = {},
}) => {
  let switchRef = useRef();
  let { toggleCollapse, save, edit, remove } = domainFns;

  let [errorMsg, setErrorMsg] = useState('');

  let _onSave = (id) => {
    try {
      let found = list.find(
        (proxy) =>
          proxy.__ref.id !== id &&
          (proxy.url || '').trim() === (url || '').trim()
      );

      if (!url || !url.trim()) {
        setErrorMsg(`URL is compulsory.`);
        return;
      }
      if (!set_for || !set_for.trim()) {
        setErrorMsg(`Setfor is compulsory.`);
        return;
      }

      if (found) {
        setErrorMsg(`Proxy server with this host is already added.`);
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
          if (switchRef.current.contains(e.target)) return;
          toggleCollapse(id);
        }}
      >
        <div className="fc-collapse-head-arrow"></div>
        <span>{url || ''}</span>
        <div className="fc-ssl-domain-list-item-head-switch" ref={switchRef}>
          <SwitchButton
            id={id}
            checked={disable}
            onChange={(value) => edit(id, { disable: value })}
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
            url={url || ''}
            reject_unauthorized={reject_unauthorized || false}
            no_proxy={no_proxy || ''}
            set_for={set_for || ''}
            onUpdate={(key, value) => {
              edit(id, { [key]: value });

              if (errorMsg !== '') {
                setErrorMsg('');
              }
            }}
            errorMsg={errorMsg}
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
        key={`remove-proxy-${id}`}
        id={`remove-proxy-${id}`}
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
  url = '',
  reject_unauthorized = false,
  no_proxy = '',
  set_for = '',
  errorMsg = '',
  onUpdate = () => {},
}) => {
  let _handleInputChange = (e) => {
    if (e) e.preventDefault();

    let { name, value } = e.target;

    if (name === 'url') {
      value = value.trim();
    }

    onUpdate(name, value);
  };

  return (
    <form
      className="fc-form grid max-w-sm"
      onSubmit={(e) => {
        e && e.preventDefault();
      }}
    >
      <Input
        name="url"
        className="mb-2"
        value={url || ''}
        autoFocus={true}
        placeholder="protocol://user:password@host:port"
        onChange={_handleInputChange}
        label="URL:"
      />
      <TextArea
        name="no_proxy"
        className="fc-input bg-appBackground2 fc-input-minwidth small"
        placeholder="Add hosts/domains separate via new line"
        value={no_proxy || ''}
        onChange={_handleInputChange}
        label="No Proxy:"
      />
      <TextArea
        name="set_for"
        className="fc-input bg-appBackground2 fc-input-minwidth small"
        placeholder="Add Domain, Host or Request URL separate via new line or * for all APIs"
        value={set_for || ''}
        onChange={_handleInputChange}
        label="Set for:"
      />
      <div
        className={classnames(
          'fc-form-group form-group relative',
          formgroupClassname
        )}
      >
        <label></label>
        <Checkbox
          isChecked={reject_unauthorized}
          checkboxFor={'Reject unauthorized'}
          tabIndex={0}
          onToggleCheck={() =>
            onUpdate('reject_unauthorized', !reject_unauthorized)
          }
          label="Reject unauthorized"
        />
      </div>
      <div className="text-error text-sm">{errorMsg}</div>
    </form>
  );
};

export default DomainList;
export { DomainBody, DomainControls };

interface IDomainList {
  list: any[]; // [] //todo: define a proper type here
  domainFns: any; // {}
}

interface IDomainItem {
  id: string;
  url: string;
  disable: boolean;
  reject_unauthorized: boolean;
  no_proxy: string;
  set_for: string;
  list: any[]; //todo: define a proper type here
  isCollapsed: boolean; //todo: check camelcase mixup here
  isUpdated: boolean; //todo: check camelcase mixup here

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
  url: string;
  reject_unauthorized: boolean;
  no_proxy: string;
  set_for: string;
  errorMsg: string;
  onUpdate: Function;
}
