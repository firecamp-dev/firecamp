import _cloneDeep from 'lodash/cloneDeep';
import shallow from 'zustand/shallow';
import { Url, UrlBar, HttpMethodDropDown, Button } from '@firecamp/ui-kit';
import { EHttpMethod, EFirecampAgent } from '@firecamp/types';
import _url from '@firecamp/url';
import { IStore, useStore } from '../../../store';

const methods = Object.values(EHttpMethod);

const UrlBarContainer = ({
  tab,
  collectionId = '',
  onPasteCurl = (curl: string) => {},
}) => {

  const {
    url,
    method,
    __meta,
    __ref,
    isRequestRunning,
    isRequestSaved,
    context,
    changeUrl,
    changeMethod,
    execute,
    save,
  } = useStore(
    (s: IStore) => ({
      url: s.request.url,
      method: s.request.method,
      __meta: s.request.__meta,
      __ref: s.request.__ref,
      isRequestRunning: s.runtime.isRequestRunning,
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,
      changeUrl: s.changeUrl,
      changeMethod: s.changeMethod,
      execute: s.execute,
      save: s.save,
    }),
    shallow
  );

  const _handleUrlChange = (e: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    e.preventDefault();
    const value = e.target.value;

    const urlObject = _url.updateByRaw({ ...url, raw: value });
    // console.log(urlObject, "urlObject... in url bar")
    changeUrl(urlObject);
  };

  const _onPaste = (edt: any) => {
    if (!edt) return;
    const curl = edt.getValue();
    if (curl) {
      onPasteCurl(curl);
    }
  };

  const _onSave = async () => {
    try {
      save(tab.id);
    } catch (e) {
      console.error(e);
    }
  };

  const _onChangeVariables = (variables: { workspace: {}; collection: {} }) => {
    // console.log({ variables });

    const collectionUpdates = {
      id: collectionId || '',
      environmentId: collectionId,
      variables: variables.collection,
    };

    context.environment.setVariables(collectionUpdates);
  };

  const _onExecute = async () => {
    try {
      // do not execute if url is empty
      if (!url.raw) return;

      const envVariables = {merged: {}, collection: {}, workspace: {}}
      const { env: tabEnv } = context.environment.getCurrentTabEnv(
        tab.id
      );
      if(tabEnv) {
        envVariables.collection = { ...(tabEnv.variables|| {}) };
      }
      const agent: EFirecampAgent = context.getFirecampAgent();
      execute(_cloneDeep(envVariables), agent, _onChangeVariables);
    } catch (error) {
      console.error({ API: 'rest._onExecute' });
    }
  };

  return (
    <UrlBar
      nodePath={__meta.name}
      showEditIcon={isRequestSaved}
      onEditClick={() => {
        context.app.modals.openEditRequest({
          name: __meta.name,
          description: __meta.description,
          collectionId: __ref.collectionId,
          requestId: __ref.id,
        });
      }}
    >
      <UrlBar.Prefix>
        <HttpMethodDropDown
          id={tab.id}
          dropdownOptions={methods}
          selectedOption={(method || '').toUpperCase()}
          onSelectItem={(m: EHttpMethod) => changeMethod(m)}
        />
      </UrlBar.Prefix>
      <UrlBar.Body>
        <Url
          id={`url-${tab.id}`}
          url={url?.raw || ''}
          placeholder={'http://'}
          onChangeURL={_handleUrlChange}
          onEnter={_onExecute}
          onPaste={_onPaste}
        />
      </UrlBar.Body>
      <UrlBar.Suffix>
        <Button
          primary
          sm
          onClick={_onExecute}
          text={isRequestRunning === true ? `Stop` : `Send`}
        />
        <Button
          id={`save-request-${tab.id}`}
          secondary
          sm
          text="Save"
          disabled={false}
          onClick={_onSave}
        />
      </UrlBar.Suffix>
    </UrlBar>
  );
};

export default UrlBarContainer;
