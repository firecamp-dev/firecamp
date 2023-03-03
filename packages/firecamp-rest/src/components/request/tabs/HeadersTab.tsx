import { useEffect } from 'react';
import shallow from 'zustand/shallow';
import { EEditorLanguage } from '@firecamp/types';
import {
  BulkEditTable,
  Container,
  BasicTable,
  TabHeader,
} from '@firecamp/ui-kit';
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
          true || (authHeaders && authHeaders.length) ? (
            <div className="pt-14">
              <TabHeader className="-mb-2">
                <TabHeader.Left>
                  <span className="">{'Headers derived from auth'}</span>
                </TabHeader.Left>
              </TabHeader>

              <BasicTable
                key={'authHeaders'}
                columns={[
                  {
                    id: 'select',
                    key: 'disable',
                    name: '',
                    width: '40px',
                    fixedWidth: true,
                  },
                  { id: 'key', key: 'key', name: 'Key', width: '150px' },
                  {
                    id: 'value',
                    key: 'value',
                    name: 'Value',
                    width: '150px',
                    resizeWithContainer: true,
                  },
                  {
                    id: 'remove',
                    key: '',
                    name: '',
                    width: '20px',
                    fixedWidth: true,
                  },
                ]}
                rows={authHeaders}
                title="Headers derived from auth"
                options={{
                  hideRowAdd: true,
                  disabledColumns: ['key', 'value'],
                  languages: {
                    key: EEditorLanguage.HeaderKey,
                    value: EEditorLanguage.HeaderValue,
                  },
                }}
                onChange={() => {}}
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
