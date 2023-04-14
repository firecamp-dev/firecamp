import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { FaFile } from '@react-icons/all-files/fa/FaFile';
import shallow from 'zustand/shallow';
import { EHttpMethod } from '@firecamp/types';
import _url from '@firecamp/url';
import { Button, Url, UrlBar, HttpMethodDropDown } from '@firecamp/ui';
import { IStore, useStore } from '../../../store';

const methods = Object.values(EHttpMethod);

const UrlBarContainer = ({ tab }) => {
  const {
    url,
    method,
    __meta,
    __ref,
    requestPath,
    isRequestSaved,
    context,
    changeUrl,
    changeMethod,
    fetchIntrospectionSchema,
    toggleDoc,
    save,
  } = useStore(
    (s: IStore) => ({
      url: s.request.url,
      method: s.request.method,
      __meta: s.request.__meta,
      __ref: s.request.__ref,
      requestPath: s.runtime.requestPath,
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,
      changeUrl: s.changeUrl,
      changeMethod: s.changeMethod,
      fetchIntrospectionSchema: s.fetchIntrospectionSchema,
      toggleDoc: s.toggleDoc,
      save: s.save,
    }),
    shallow
  );

  const schema = {};

  const _handleUrlChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const urlObject = _url.updateByRaw({ ...url, raw: value });
    changeUrl(urlObject);
  };

  const _toggleGraphqlDoc = () => {
    if (url?.raw?.length && (!schema || !Object.keys(schema).length)) {
      fetchIntrospectionSchema();
    }
    toggleDoc(true);
  };

  const _onSave = async () => {
    try {
      save(tab.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Url
      id={`url-${tab.id}`}
      path={requestPath?.path || 'Untitled Request'}
      placeholder={'http://'}
      isRequestSaved={isRequestSaved}
      url={url.raw}
      onChange={_handleUrlChange}
      // onPaste={_onPaste}
      onEnter={fetchIntrospectionSchema}
      promptRenameRequest={() => {
        context.app.modals.openEditRequest({
          name: __meta.name,
          description: __meta.description,
          collectionId: __ref.collectionId,
          requestId: __ref.id,
          requestType: __meta.type
        });
      }}
      prefixComponent={
        <HttpMethodDropDown
          id={tab.id}
          className={'urlbar-input-type select-box'} //TODO: check this class is needed or not
          dropdownOptions={methods}
          selectedOption={(method || '').toUpperCase()}
          onSelectItem={(m: EHttpMethod) => changeMethod(m)}
        />
      }
      suffixComponent={
        <>
          <Button
            onClick={_toggleGraphqlDoc}
            icon={<FaFile fontSize={16} />}
            id={`open-schema-doc-${tab.id}`}
            tooltip={'open schema doc'}
            secondary
            sm
          />
          <Button
            icon={<VscRefresh fontSize={18} strokeWidth={0.5} />}
            onClick={fetchIntrospectionSchema}
            id={`refresh-schema-${tab.id}`}
            tooltip={'refresh schema'}
            iconLeft
            primary
            sm
          />
          <Button
            id={`save-request-${tab.id}`}
            text="Save"
            onClick={_onSave}
            disabled={false}
            secondary
            sm
          />
        </>
      }
    />
  );
};

export default UrlBarContainer;
