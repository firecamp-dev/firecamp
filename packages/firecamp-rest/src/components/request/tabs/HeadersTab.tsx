import { useEffect } from 'react';
import shallow from 'zustand/shallow';
import { BulkEditTable, Container, BasicTable } from '@firecamp/ui-kit';
import { IStore, useStore } from '../../../store';
import { EEditorLanguage } from '@firecamp/types';

const HeadersTab = () => {
  const { headers, authHeaders, changeHeaders } = useStore(
    (s: IStore) => ({
      headers: s.request.headers,
      authHeaders: s.runtime.authHeaders,
      changeHeaders: s.changeHeaders,
    }),
    shallow
  );

  useEffect(() => {
    console.log('1. re-rendering the header tabs');
  }, [headers]);

  const onHeaderChange = (headers) => {
    changeHeaders(headers);
  };

  return (
    <Container>
      <Container.Body>
        <BulkEditTable
          key={'headers'}
          rows={headers}
          title="Headers"
          onChange={(data) => onHeaderChange(data)}
          onMount={() => {}}
          meta={{
            mode: {
              key: EEditorLanguage.HeaderKey,
              value: EEditorLanguage.HeaderValue,
            },
          }}
        />
        {/* <SingleLineEditor type="text" path="a" value="123" />
        <SingleLineEditor type="text" path="b" value="qwqe" />
        <SingleLineEditor type="text" path="c" value="66666666" />
        <SingleLineEditor type="text" path="d" value="fgfgfg" />
        <SingleLineEditor type="text" path="e" value="tytytyty" />
        <SingleLineEditor type="text" path="f" value="bbbb" /> */}

        {/* <BasicTable resizable={true} /> */}

        {
          // ctx_tabData.type //todo: implement this auth header feature later after migration
          authHeaders && authHeaders.length ? (
            <div className="pt-14">
              <BasicTable
                key={'authHeaders'}
                rows={authHeaders}
                title="Headers derived from auth"
                disable={true}
                options={{
                  mode: {
                    key: EEditorLanguage.HeaderKey,
                    value: EEditorLanguage.HeaderValue,
                  },
                  language: EEditorLanguage.HeaderKey,
                }}
              />
            </div>
          ) : (
            <></>
          )
        }
      </Container.Body>
    </Container>
  );
};

export default HeadersTab;
