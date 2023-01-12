import { useEffect } from 'react';
import shallow from 'zustand/shallow';
import { EEditorLanguage } from '@firecamp/types';
import { BulkEditTable, Container, BasicTable } from '@firecamp/ui-kit';
import { IStore, useStore } from '../../../store';

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
