import { useEffect } from 'react';
import { EEditorLanguage } from '@firecamp/types';
import { BulkEditTable, Container, BasicTable, TabHeader } from '@firecamp/ui';
import { useRequestHeadersFacade } from '../useFacade';

const HeadersTab = () => {
  const { headers, authHeaders, changeHeaders } = useRequestHeadersFacade();

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
          onMount={() => { }}
        />

        {authHeaders?.length ? (
          <div className="pt-14">
            <TabHeader className="-mb-2">
              <TabHeader.Left>
                <span className="">{'Headers derived from auth'}</span>
              </TabHeader.Left>
            </TabHeader>

            <BasicTable
              key={'authHeaders'}
              columns={[
                { id: 'key', key: 'key', name: 'Key', width: '150px' },
                {
                  id: 'value',
                  key: 'value',
                  name: 'Value',
                  width: '150px',
                  resizeWithContainer: true,
                },
              ]}
              rows={authHeaders}
              options={{
                hideRowAdd: true,
                disabledColumns: ['key', 'value'],
                languages: {
                  key: EEditorLanguage.HeaderKey,
                  value: EEditorLanguage.HeaderValue,
                },
              }}
              onChange={() => { }}
            />
          </div>
        ) : (
          <></>
        )}
      </Container.Body>
    </Container>
  );
};

export default HeadersTab;
