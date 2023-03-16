import { memo, useState } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import {
  RootContainer,
  Container,
  Loader,
  TabHeader,
  SecondaryTab,
  Row,
} from '@firecamp/ui';
import { _array, _auth, _env, _object } from '@firecamp/utils';
import ImportRaw from './import-tabs/ImportRaw';
import ImportDropZone from './import-tabs/ImportDrop';

enum ETabTypes {
  ImportRaw = 'import-raw',
  ImportFile = 'import-file',
}
type TState = {
  raw: string;
  activeTab: ETabTypes;
  isImporting: boolean;
};

const ImportTab = ({ tab, platformContext: context }) => {
  const entityId = tab.__meta.entityId;
  if (!entityId) return <></>;

  const [state, setState] = useState<TState>({
    raw: '',
    activeTab: ETabTypes.ImportRaw,
    isImporting: false,
  });

  const { activeTab, isImporting } = state;

  const tabs = [
    { name: 'Import Raw', id: ETabTypes.ImportRaw },
    { name: 'Import File', id: ETabTypes.ImportFile },
  ];

  const importCollection = (collection: string) => {
    try {
      const payload = JSON.parse(collection);
      setState((s) => ({ ...s, isImporting: true }));
      context.collection
        .import(payload)
        .then((res) => {
          console.log(res, 'import response');
          setState((s) => ({ ...s, isImporting: false }));
          context.app.notify.success(
            'You have successfully imported the collection'
          );
          setTimeout(() => {
            context.tab.close(tab.id);
          }, 100);
        })
        .catch((e) => {
          console.log(e.response);
          context.app.notify.alert(e?.response?.data?.message || e?.message);
          setState((s) => ({ ...s, isImporting: false }));
        });
    } catch (e) {
      context.app.notify.alert('The collection format is not valid');
    }
  };

  if (isImporting === true)
    return <Loader message="Importing the collection" />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <Container className="with-divider">
          <Container.Header>
            <TabHeader className="height-ex-small bg-statusBarBackground2 !pl-3 !pr-3">
              <TabHeader.Left>
                <div className="user-select flex text-base font-semibold">
                  Import Collection
                </div>
              </TabHeader.Left>
            </TabHeader>
          </Container.Header>
          <Container.Body className="flex flex-col">
            <SecondaryTab
              className="flex items-center px-4 pt-5 w-full pb-0"
              list={tabs}
              activeTab={activeTab}
              onSelect={(tabId: ETabTypes) => {
                setState((s) => ({ ...s, activeTab: tabId }));
              }}
            />
            <Row flex={1} overflow="auto" className="with-divider h-full">
              <div className="m-6 border border-appBorder flex-1 overflow-hidden">
                {state.activeTab == ETabTypes.ImportRaw ? (
                  <ImportRaw
                    raw={state.raw}
                    id={entityId}
                    onChange={(raw) => setState((s) => ({ ...s, raw }))}
                    importCollection={() => importCollection(state.raw)}
                  />
                ) : (
                  <ImportDropZone
                    importCollection={importCollection}
                    isImporting={isImporting}
                  />
                )}
              </div>
            </Row>
          </Container.Body>
        </Container>
      </Container>
    </RootContainer>
  );
};
export default memo(ImportTab, (p, n) => !isEqual(p, n));
