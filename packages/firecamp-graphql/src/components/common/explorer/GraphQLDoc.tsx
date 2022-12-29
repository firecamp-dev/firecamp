import { useEffect, useState } from 'react';
import { buildClientSchema } from 'graphql';
import shallow from 'zustand/shallow';
import { isEmpty } from 'lodash';

import { DocExplorer } from '../doc-explorer/DocExplorer';
import { useStore } from '../../../store';

const DocExplorerCmp = () => {
  let { schema, toggleDoc } = useStore(
    (s: any) => ({
      schema: s.runtime.schema,
      toggleDoc: s.toggleDoc,
    }),
    shallow
  );

  let [clientSchema, setClientSchema] = useState<any>({});

  useEffect(() => {
    schema && setClientSchema(buildClientSchema(schema));
  }, [schema]);

  if (isEmpty(clientSchema)) return <></>;
  return (
    <div className={'firecamp-doc-explorer docExplorerWrap'}>
      <div className="docExplorerResizer" />
      <DocExplorer schema={clientSchema}>
        <button
          className="docExplorerHide"
          onClick={(_) => toggleDoc(false)}
          aria-label="Close Documentation Explorer"
        >
          {'\u2715'}
        </button>
      </DocExplorer>
    </div>
  );
};

const DocWrapper = () => {
  let { schema, isDocOpened } = useStore(
    (s: any) => ({
      schema: s.runtime.schema,
      isDocOpened: s.runtime.isDocOpened,
    }),
    shallow
  );

  if (!schema || !isDocOpened) return <></>;
  return <DocExplorerCmp />;
};

export default DocWrapper;
export { DocExplorerCmp };
