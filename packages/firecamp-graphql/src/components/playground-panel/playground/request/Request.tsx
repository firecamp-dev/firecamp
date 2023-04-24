import { useState } from 'react';
import shallow from 'zustand/shallow';
import { Container, Column, Resizable } from '@firecamp/ui';
import ReqStatusbar from './statusbar/ReqStatusbar';
// import QueryEditorMonaco from './query-editor/QueryEditor.monaco';
import QueryEditor from './query-editor/QueryEditor';
import PlaygroundFooter from './footerbar/PlaygroundFooter';
import { IStore, useStore } from '../../../../store';
import './sass/doc-explorer.css';

const Request = () => {
  const [isQueryDirty, toggleQueryDirty] = useState(false);
  const { playground, activePlayground, changePlaygroundValue } = useStore(
    (s: IStore) => ({
      playground: s.playgrounds[s.runtime.activePlayground],
      activePlayground: s.runtime.activePlayground,
      changePlaygroundValue: s.changePlaygroundValue,
    }),
    shallow
  );
  const onChangeEditor = (value) => {
    changePlaygroundValue(activePlayground, value);
  };

  return (
    <Column overflow="hidden">
      <Container className="with-divider border-r border-appBorder">
        <Container.Header>
          <ReqStatusbar />
        </Container.Header>
        <Container.Body>
          <QueryEditor
            isQueryDirty={isQueryDirty}
            toggleQueryDirty={toggleQueryDirty}
            value={playground.request.value.query}
            onChange={(v) => onChangeEditor(v)}
          />
          {/* <QueryEditorMonaco
            isQueryDirty={isQueryDirty}
            toggleQueryDirty={toggleQueryDirty}
          /> */}
        </Container.Body>
        <Resizable
          top={true}
          width="100%"
          minHeight={100}
          maxHeight={300}
          height={120}
        >
          <Container.Footer className="overflow-hidden">
            <PlaygroundFooter />
          </Container.Footer>
        </Resizable>
      </Container>
    </Column>
  );
};

export default Request;
