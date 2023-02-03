import {
  EHttpMethod,
  ERequestTypes,
  EScriptLanguages,
  EScriptTypes,
  EVariableType,
  IRest,
  TVariable,
} from '@firecamp/types';
import {
  preScript,
  // postScript
} from '../';

const request: IRest = {
  method: EHttpMethod.GET,
  preScripts: [
    {
      id: '123',
      language: EScriptLanguages.JavaScript,
      type: EScriptTypes.PreRequest,
      value: [
        `fc.globals.get('name', 'Firecamp')`,
        `fc.globals.set('founded', '2023')`,
        `console.log(fc.globals)`,
      ],
    },
  ],
  postScripts: [],
  __meta: {
    name: 'script',
    type: ERequestTypes.Rest,
    version: '2.0.0',
  },
  __ref: {
    id: '',
    collectionId: '',
  },
};

// let postScriptResponse;

beforeAll(async () => {
  // preScriptRes = await preScript(request, { key: 'a', value: 'b' });
  // postScriptResponse = await postScript(
  //   //@ts-ignore
  //   request.postScripts || [],
  //   {
  //     statusCode: 202,
  //   },
  //   {}
  // );
});

describe('pre-script, x = globals | environment | collectionVariables', () => {
  const globalsVars: TVariable[] = [
    {
      id: 'g-1',
      key: 'name',
      value: 'Ramanujan',
      type: EVariableType.text,
    },
  ];
  const environmentVars: TVariable[] = [
    {
      id: 'e-1',
      key: 'age',
      value: '32',
      type: EVariableType.number,
    },
  ];
  const collectionVars: TVariable[] = [
    {
      id: 'c-1',
      key: 'isMathematician',
      value: 'true',
      type: EVariableType.boolean,
    },
  ];

  it('fc.x.get(variableName)', async () => {
    const script = [
      'let result = {}',
      'result.name = fc.globals.get("name")',
      'result.age = fc.environment.get("age")',
      'result.isMathematician = fc.collectionVariables.get("isMathematician")',
    ];
    const __request = {
      ...request,
      preScripts: [
        {
          ...request.preScripts[0],
          value: script,
        },
      ],
    };
    const { result } = await preScript(__request, {
      globals: globalsVars,
      environment: environmentVars,
      collection: collectionVars,
    });
    const expected = {
      name: globalsVars[0].value,
      age: +environmentVars[0].value, // must be number
      isMathematician: !!collectionVars[0].value, // mustbe boolean
    };
    expect(result).toMatchObject(expected);
  });

  it('fc.x.set(variableName, value)', async () => {
    const expexted = {
      name: 'Srinivasa Ramanujan',
      age: 31,
      notMathematician: false,
    };
    /**
     * 1. set values
     * 2. then get values for assertion
     */
    const script = [
      `fc.globals.set('name', '${expexted.name}')`,
      `fc.environment.set('age', ${expexted.age})`,
      `fc.collectionVariables.set('notMathematician', false)`,
      'let result = {}',
      'result.name = fc.globals.get("name")',
      'result.age = fc.environment.get("age")',
      'result.notMathematician = fc.collectionVariables.get("notMathematician")',
    ];
    const __request = {
      ...request,
      preScripts: [
        {
          ...request.preScripts[0],
          value: script,
        },
      ],
    };
    const { result } = await preScript(__request, {
      globals: globalsVars,
      environment: environmentVars,
      collection: collectionVars,
    });
    expect(result).toMatchObject(expexted);
  });

  it('fc.x.unset(variableName)', async () => {
    const expexted = {
      name: '',
      age: '',
      isMathematician: '',
    };
    /**
     * 1. set values
     * 2. then get values for assertion
     */
    const script = [
      `fc.globals.unset('name', '${expexted.name}')`,
      `fc.environment.unset('age', ${expexted.age})`,
      `fc.collectionVariables.unset('isMathematician', false)`,
      'let result = {}',
      'result.name = fc.globals.get("name")',
      'result.age = fc.environment.get("age")',
      'result.isMathematician = fc.collectionVariables.get("isMathematician")',
    ];
    const __request = {
      ...request,
      preScripts: [
        {
          ...request.preScripts[0],
          value: script,
        },
      ],
    };
    const { result } = await preScript(__request, {
      globals: globalsVars,
      environment: environmentVars,
      collection: collectionVars,
    });
    expect(result).toMatchObject(expexted);
  });

  // it('should set new header', () => {
  //   expect(preScriptRes.request.headers).toMatchObject([
  //     { key: 'content-type', value: 'application/json' },
  //   ]);
  // });

  // it('should set new query param', () => {
  //   expect(preScriptRes.request.url.queryParams).toMatchObject([
  //     { key: 'id', value: '1' },
  //   ]);
  // });

  // it('should set collection env variable', () => {
  //   expect(preScriptRes.environment.collection.variables).toMatchObject({
  //     token: 123,
  //   });
  // });

  // it('should set workspace env variable', () => {
  //   expect(preScriptRes.environment.workspace.variables).toMatchObject({
  //     id: 1,
  //   });
  // });
});

// describe('post script', () => {
//   it('should set collection env variable', () => {
//     expect(postScriptResponse.environment.collection.variables).toMatchObject({
//       token: 123,
//     });
//   });

//   it('should set workspace env variable', () => {
//     expect(postScriptResponse.environment.workspace.variables).toMatchObject({
//       id: 1,
//     });
//   });
// });
