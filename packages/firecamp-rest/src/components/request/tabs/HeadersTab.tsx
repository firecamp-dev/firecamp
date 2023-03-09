import { useEffect } from 'react';
import shallow from 'zustand/shallow';
import { EEditorLanguage } from '@firecamp/types';
import { BulkEditTable, Container, BasicTable } from '@firecamp/ui';
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
          options={{
            languages: {
              key: EEditorLanguage.HeaderKey,
              value: EEditorLanguage.HeaderValue,
            },
          }}
          onChange={(data) => onHeaderChange(data)}
          onMount={() => {}}
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
                  languages: {
                    key: EEditorLanguage.HeaderKey,
                    value: EEditorLanguage.HeaderValue,
                  },
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
