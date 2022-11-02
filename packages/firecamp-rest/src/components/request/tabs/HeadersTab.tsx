import { useEffect } from 'react';
import shallow from 'zustand/shallow';

import {
  BasicTable,
  BasicTableV3,
  SingleLineEditor,
  PrimaryIFT,
  BulkEditIFT,
  Container,
} from '@firecamp/ui-kit';

import { useRestStore } from '../../../store';

const HeadersTab = () => {
  let { headers, auth_headers, changeHeaders } = useRestStore(
    (s: any) => ({
      headers: s.request.headers,
      auth_headers: s.runtime.auth_headers,
      changeHeaders: s.changeHeaders,
    }),
    shallow
  );

  useEffect(() => {
    console.log('1. re-rendering the header tabs');
  }, [headers]);

  let onHeaderChange = (headers) => {
    changeHeaders(headers);
  };

  return (
    <Container>
      <Container.Body>
        <BulkEditIFT
          onChange={(data) => onHeaderChange(data)}
          key={'headers'}
          rows={headers}
          title="Headers"
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
        <BasicTableV3
          initialRows={[{ key: 'name', value: 'Nishchit' }]}
          onChange={console.log}
          // onLoad={(tApi) => {}}
        />
        {
          // ctx_tabData.type //todo: implement this auth header feature later after migration
          auth_headers && auth_headers.length ? (
            <div className="pt-14">
              <PrimaryIFT
                key={'auth_headers'}
                rows={auth_headers}
                title="Headers derived from auth"
                disable={true}
                meta={{
                  mode: {
                    key: 'ife-header-key',
                    value: 'ife-header-value',
                  },
                  language: 'ife-header-key',
                  allowDescription: false,
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
