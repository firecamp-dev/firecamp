import { memo, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import {
  RootContainer,
  Container,
  Loader,
  TabHeader,
  ProgressBar,
  SecondaryTab,
  Row,
} from '@firecamp/ui-kit';
import { _array, _auth, _env, _object } from '@firecamp/utils';
import ImportRaw from './import-tabs/ImportRaw';

enum ETabTypes {
  ImportRaw = 'import-raw',
  ImportFile = 'import-file',
}
type TState = {
  raw: string;
  activeTab: ETabTypes;
  isFetchingEntity: boolean;
  isUpdatingEntity: boolean;
};

const ImportTab = ({ tab, platformContext: context }) => {
  const entity = _cloneDeep({ ...tab.entity });
  const entityType = tab.__meta.entityType;
  const entityId = tab.__meta.entityId;
  if (!entityId) return <></>;

  const [state, setState] = useState<TState>({
    raw: '',
    activeTab: ETabTypes.ImportRaw,
    isFetchingEntity: false,
    isUpdatingEntity: false,
  });

  const {
    activeTab,
    // isFetchingEntity,
    // isUpdatingEntity,
  } = state;

  const tabs = [
    { name: 'Import Raw', id: ETabTypes.ImportRaw },
    { name: 'Import File', id: ETabTypes.ImportFile },
  ];

  // if (isFetchingEntity === true) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <ProgressBar active={true} />
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
                    onImport={(raw) => {}}
                  />
                ) : (
                  <>Coming Soon...</>
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
