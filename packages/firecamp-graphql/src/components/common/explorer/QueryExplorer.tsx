import { useState, useEffect } from 'react';
import GraphiQLExplorer from 'graphiql-explorer';
import shallow from 'zustand/shallow';
import { buildClientSchema } from 'graphql';

import { useStore } from '../../../store';
import { isEmpty } from 'lodash';

import './QueryExplorer.scss';

// import getQueryFacts from '../../../services/GraphQLservice';

const QueryExplorer = () => {
  let { playground, activePlayground, schema, changePlaygroundValue } =
    useStore(
      (s: any) => ({
        schema: s.runtime.schema,
        activePlayground: s.runtime.activePlayground,
        playground: s.playgrounds[s.runtime.activePlayground],
        changePlaygroundValue: s.changePlaygroundValue,
      }),
      shallow
    );

  let [clientSchema, setClientSchema] = useState({});

  useEffect(() => {
    schema && setClientSchema(buildClientSchema(schema));
  }, [schema]);

  let tabId = 123;

  // console.log(clientSchema, "clientSchema...")

  let mergeSingleQueryToQueries = (_) => {};

  useEffect(() => {}, []);

  let _onEdit = (value) => {
    console.log({ value });
    changePlaygroundValue(activePlayground, value);
    // debugger;
    // setCurrentQueryPayload(queryPayload);
    // mergeSingleQueryToQueries(queryPayload);
  };

  if (isEmpty(clientSchema)) return <></>;

  return (
    <GraphiQLExplorer
      id={`query-explorer-${tabId}`}
      schema={clientSchema}
      query={playground.request.value}
      onEdit={_onEdit}
      explorerIsOpen={true}
      onToggleExplorer={(_) => console.log()}
      arrowOpen={
        <svg
          style={{ marginRight: 4 }}
          fill="#666"
          height="10px"
          width="10px"
          viewBox="0 0 1024 574"
          aria-labelledby="cmsi-ant-down-title"
          id="si-ant-down"
        >
          <title id="cmsi-ant-down-title">icon down</title>
          <path d="M1015 10q-10-10-23-10t-23 10L512 492 55 10Q45 0 32 0T9 10Q0 20 0 34t9 24l480 506q10 10 23 10t23-10l480-506q9-10 9-24t-9-24z"></path>
        </svg>
      }
      arrowClosed={
        <svg
          style={{ marginRight: 4 }}
          fill="#666"
          height="10px"
          width="10px"
          viewBox="0 0 574 1024"
          aria-labelledby="fqsi-ant-right-title"
          id="si-ant-right"
        >
          <title id="fqsi-ant-right-title">icon right</title>
          <path d="M10 9Q0 19 0 32t10 23l482 457L10 969Q0 979 0 992t10 23q10 9 24 9t24-9l506-480q10-10 10-23t-10-23L58 9Q48 0 34 0T10 9z"></path>
        </svg>
      }
      checkboxChecked={
        <svg
          style={{ marginRight: 4 }}
          fill="#d37b1b"
          height="16px"
          width="16px"
          viewBox="0 0 384 384"
          aria-labelledby="abksi-ionic-android-checkbox-outline-title"
          id="si-ionic-android-checkbox-outline"
        >
          <title id="abksi-ionic-android-checkbox-outline-title">
            icon android-checkbox-outline
          </title>
          <path d="M104.531 151.469l-29.864 29.864 96 96L384 64l-29.864-29.864-183.469 182.395-66.136-65.062zm236.802 189.864H42.667V42.667H256V0H42.667C19.198 0 0 19.198 0 42.667v298.666C0 364.802 19.198 384 42.667 384h298.666C364.802 384 384 364.802 384 341.333V170.667h-42.667v170.666z"></path>
        </svg>
        // <svg fill="#999" height="12px" width="12px" viewBox="0 0 12 12" aria-labelledby="gzsi-typcn-media-stop-title" id="si-typcn-media-stop"><title id="gzsi-typcn-media-stop-title">icon media-stop</title><path d="M10 0H2C.9 0 0 .9 0 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z"></path></svg>
        // <svg fill="#666" height="12px" width="12px" viewBox="0 0 1663 1408" aria-labelledby="ewsi-awesome-check-square-o-title" id="si-awesome-check-square-o"><title id="ewsi-awesome-check-square-o-title">icon check-square-o</title><path d="M1408 802v318q0 119-84.5 203.5T1120 1408H288q-119 0-203.5-84.5T0 1120V288Q0 169 84.5 84.5T288 0h832q63 0 117 25 15 7 18 23 3 17-9 29l-49 49q-10 10-23 10-3 0-9-2-23-6-45-6H288q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113V866q0-13 9-22l64-64q10-10 23-10 6 0 12 3 20 8 20 29zm231-489l-814 814q-24 24-57 24t-57-24L281 697q-24-24-24-57t24-57l110-110q24-24 57-24t57 24l263 263 647-647q24-24 57-24t57 24l110 110q24 24 24 57t-24 57z"></path></svg>
      }
      checkboxUnchecked={
        <svg
          id="explorer-uncheck-box" //border is being set from css of this ID
          style={{ marginRight: 4 }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <rect
            x="1"
            y="1"
            width="14"
            height="14"
            stroke="none"
            strokeWidth="2"
          />
        </svg>
      }
    />
  );
};

export default QueryExplorer;
