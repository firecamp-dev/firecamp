import { useEffect } from 'react';
import shallow from 'zustand/shallow';
import {  BulkEditTable, Container, BasicTable } from '@firecamp/ui-kit';
import { IStore, useRestStore } from '../../../store';

const HeadersTab = () => {
  const { headers, authHeaders, changeHeaders } = useRestStore(
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
              key: 'ife-header-key',
              value: 'ife-header-value',
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
                    key: 'ife-header-key',
                    value: 'ife-header-value',
                  },
                  language: 'ife-header-key',
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
