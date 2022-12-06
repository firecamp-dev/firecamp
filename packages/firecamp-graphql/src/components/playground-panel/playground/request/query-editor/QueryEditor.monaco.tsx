import { useState, useRef, useEffect } from 'react';
import { print } from 'graphql/language/printer';
import { Container, Column, Editor } from '@firecamp/ui-kit';
import { _table } from '@firecamp/utils';
import getQueryFacts, {
  getCurrentOperation,
} from '../../../../../services/GraphQLservice';
import {
  QUERY_TYPES,
  STRINGS_QUERY_TYPES,
} from '../../../../../constants/constants';

const QueryEditorMonaco = ({ isQueryDirty, toggleQueryDirty }) => {
  const clientSchemaRef = useRef({});
  const currentQueryRef = useRef({});

  const updateQuery = () => {};
  const updateCurrentQuery = (a: any) => {};

  const ctx_graphql_body = {
    body: '',
    current_query: '',
    clientSchema: {},
    schema: {},
  };
  let { body, current_query, clientSchema, schema } = ctx_graphql_body;
  let [editorValue, setEditorValue] = useState(body);

  //when body/query will ge generated from explorer or other source like `Q|M|S` buttons then update them in playground
  useEffect(() => {
    if (body != editorValue) {
      setEditorValue(body);
    }
  }, [body]);

  if (clientSchema) {
    clientSchemaRef.current = clientSchema;
  }

  useEffect(() => {
    currentQueryRef.current = current_query;
  }, [current_query]);

  const _onCursorGetCurrentOperation = (
    value: any,
    position?: any,
    currentQuery?: any
  ) => {
    // console.log(`clientSchema`, clientSchema);
    try {
      // debugger;
      const currentOperation = getCurrentOperation(
        value,
        position.position
        // currentQuery
      );
      let operation: any = {};
      let queryPayload = {};

      operation = getQueryFacts(
        clientSchemaRef.current || {},
        print(currentOperation)
      );

      if (operation && operation.operations && operation.operations.length) {
        let q = operation.operations[0],
          queryVariablesAry = [];

        try {
          queryVariablesAry = _table.objectToTable(q.meta.variables);
        } catch (e) {
          console.log('e', e);
        }

        queryPayload = Object.assign(q, {
          name: q.name || STRINGS_QUERY_TYPES[q.meta.type.toUpperCase()],
          meta: {
            type: QUERY_TYPES[q.meta.type.toUpperCase()],
            variables: queryVariablesAry || [],
          },
          variableToType: q.variableToType || {},
        });
        delete queryPayload['type'];

        _onUpdateCurrentQuery(queryPayload);
        return queryPayload;
      }
    } catch (e) {
      console.log(`e`, e);
    }
  };

  const _onUpdateCurrentQuery = (body) => {
    updateCurrentQuery({
      name: body.name || '',
      meta: { type: body.meta.type || QUERY_TYPES.QUERY },
    });
  };

  const _onCallGQLReuqest = () => {
    let queryObject = _onCursorGetCurrentOperation(editorValue);
    // ctx_onSendRequest(queryObject.body, queryObject.meta.variables);
  };

  const _onUpdateQuery = (q) => {
    setEditorValue(q);
    updateQuery(q);
  };

  return (
    <Column flex={1} height="100%" overflow="auto">
      <Container className="with-divider">
        <Container.Body>
          <Editor
            value={editorValue || ''}
            language="graphqlDev"
            // formatOnPaste={true}
            onChange={(e) => {
              _onUpdateQuery(e.target.value);
            }}
            onLoad={(edt) => {
              edt.onDidChangeCursorPosition((position) => {
                _onCursorGetCurrentOperation(edt.getValue(), position);
                // console.log(position, 'cursor position change...');
              });
            }}
            onCtrlEnter={(_) => {
              // ctx_onSendRequest();
            }}
          />
        </Container.Body>
        <Container.Footer></Container.Footer>
      </Container>
    </Column>
  );
};

export default QueryEditorMonaco;
