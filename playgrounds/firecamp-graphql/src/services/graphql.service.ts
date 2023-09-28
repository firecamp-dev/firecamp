import { parse, print, typeFromAST } from 'graphql';
import { parse as GraphQLParse } from 'graphql/language/parser';

/**
 * Provided previous "queryFacts", a GraphQL schema, and a query document
 * string, return a set of facts about that query useful for GraphiQL features.
 *
 * If the query cannot be parsed, returns undefined.
 */
export default function getQueryFacts(schema, documentStr) {
  if (!documentStr) {
    return;
  }

  let documentAST;

  try {
    documentAST = parse(documentStr);
  } catch (e) {
    return e;
  }

  // Collect operations by their names.
  const operationList = [];
  let operations = [];
  documentAST.definitions.forEach((def) => {
    if (def.kind === 'OperationDefinition') {
      if (!def.name) {
        //todo refactor it later
        // def.name = { value: "Query" };
      }
      def.variables = {};
      def.variableToType = Object.create(null);

      const variableDefinitions = def.variableDefinitions;
      if (variableDefinitions) {
        variableDefinitions.forEach(({ variable, type }) => {
          if (schema && Object.keys(schema).length) {
            const inputType = typeFromAST(schema, type);
            if (inputType) {
              def.variableToType[variable.name.value] = inputType;
            }
          }
          // console.log(`inputType`, inputType);
          // console.log(`variable`, variable);
          def.variables = {
            ...def.variables,
            [variable.name.value]: null,
          };
        });
      }
    }

    operationList.push(def);
    operations.push({
      name: def.name ? def.name.value : undefined,
      value: {
        query: print(def),
        variables: def.variables,
      },
      __meta: {
        variableToType: def.variableToType,
        type: def.operation || 'query',
      },
    });
  });
  // console.log(`operationList`, operationList, operations);

  return {
    operationList,
    operations,
  };
}

export const isValid = async (queryStr: string): Promise<boolean> => {
  try {
    parse(queryStr);
    return Promise.resolve(true);
  } catch (e) {
    return Promise.resolve(false);
  }
};

export const getOperations = (queryStr: string) => {
  if (!queryStr) {
    return [];
  }

  let _documentAST;
  try {
    _documentAST = parse(queryStr);
    return _documentAST.definitions.filter(
      (def) => def.kind === 'OperationDefinition'
    );
  } catch (e) {
    console.log(e);
    // return e;
    // return [];
  }
};

export const getOperationNames = (value: string) => {
  try {
    const ops = getOperations(value);
    const names = ops
      .filter((op) => op.kind == 'OperationDefinition')
      .map((op) => op.name?.value || 'Query');
    return { names };
  } catch (e) {
    console.log('handled error', e);
    return { error: e, names: [] };
  }
};

export const getPlaygroundName = (value: string) => {
  const ops = getOperations(value);
  if (!ops?.length) return;

  const opsMap = {
    query: 'Q',
    mutation: 'M',
    subscription: 'S',
  };
  return ops.reduce((p, n) => {
    console.log(p, 1213);
    const separator = p ? '___' : '';
    return `${p}${separator}${opsMap[n.operation]}_${n?.name.value || 'Query'}`;
  }, '');
};

/**
 * Get current operation from the editor cursor position or from given default query
 * @param editor
 * @param defaultOperation  { name, __meta:{type}}
 * @returns {*}
 */
export const getCurrentOperation = (editor, defaultOperation) => {
  const operations = getOperations(editor.getValue()) || [];

  const cursor = editor.getCursor();
  const cursorIndex = editor.indexFromPos(cursor);

  // console.log(operations, cursor, cursorIndex, defaultOperation);
  // debugger

  let currentOperation = null;
  if (defaultOperation && defaultOperation.name) {
    let mapping = {
      Q: 'query',
      M: 'mutation',
      S: 'subscription',
    };
    currentOperation = operations.find((o) => {
      //Todo: later we change it, Here if empty query started with only { company }, then we're considering q_typw="Q" and name="Query"
      return (
        o.operation == mapping[defaultOperation.__meta.type] &&
        ((o.name || {}).value || 'Query') == defaultOperation.name
      );
    });
  } else {
    // from editor's cursor position

    // Loop through all operations to see if one contains the cursor.
    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      if (!op.name) {
        currentOperation = op;
        continue;
      }
      const { start, end } = op.loc;
      if (start <= cursorIndex && end >= cursorIndex) {
        currentOperation = op;
      }
    }
    if (!currentOperation) {
      currentOperation = operations[operations.length - 1];
    }
  }
  return currentOperation;
};

export const mergeSingleQueryWithQueries = (query, queries) => {
  /*let defaultQuery = `query {
   __typename
   }`;*/

  // console.log(query, queries, 999);
  let queriesAST, queryAST;
  try {
    queriesAST = parse(queries); // || defaultQuery);
  } catch (e) {
    console.log(e);
  }
  try {
    queryAST = parse(query);
  } catch (e) {
    console.log(e);
  }

  if (!queriesAST && queryAST) {
    queriesAST = queryAST;
  } else {
    let defIndex = queriesAST.definitions.findIndex(
      (d) => (d.name || {}).value == (queryAST.definitions[0].name || {}).value
    );

    // console.log(defIndex, queriesAST, queryAST);

    if (defIndex < 0) {
      queriesAST.definitions.push(queryAST.definitions[0]);
    } else {
      queriesAST.definitions[defIndex] = queryAST.definitions[0];
    }
  }

  /*  console.log({
    ast: queriesAST,
    text: print(queriesAST)
  }); */

  return {
    ast: queriesAST,
    text: print(queriesAST),
  };
};

export const prettifyQueryString = (value: string) => {
  try {
    const query = print(GraphQLParse(value));
    return query;
  } catch (e) {
    console.log(`e`, e);
    return value;
  }
};
