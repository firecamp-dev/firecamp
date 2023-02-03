export default {
  id: 'environment',
  name: 'Environment Snippets',
  groups: [
    {
      id: 'global',
      name: 'global variables',
      snippets: [
        {
          id: 'getGlobalVaribale',
          name: 'Get a global variable',
          value: ['fc.globals.get("variable_key");'],
        },
        {
          id: 'setGlobalVariable',
          name: 'Set a global variable',
          value: ['fc.globals.set("variable_key", "variable_value");'],
        },
        {
          id: 'clearGlobalVariable',
          name: 'Clear a global variable',
          value: ['fc.globals.unset("variable_key");'],
        },
        {
          id: 'getVariable',
          name: 'Get a variable',
          value: ['fc.variables.get("variable_key");'],
        },
        // {
        //   id: 'sendRequest',
        //   name: 'Send a request',
        //   value: [
        //     "fc.sendRequest('https://postman-echo.com/get', function (err, response) {",
        //     '   console.log(response.json());',
        //     '});',
        //   ],
        // },
      ],
      /** @deprecated */
      _snippets: [
        {
          id: 'has',
          name: 'variable exists or not',
          value: 'environment.has("variableName");',
        },
        {
          id: 'has',
          name: 'variable value',
          value: 'environment.get("variableName");',
        },
        {
          id: 'replace',
          name: 'resolve value of dynamic variables from the string content',
          value: 'environment.replace("data");',
        },
        {
          id: 'variables',
          name: 'combined variables of global and collection',
          value: 'environment.variables();',
        },
      ],
    },
    {
      id: 'environment',
      name: 'environment variables',
      snippets: [
        {
          id: 'getEnvironemntVariable',
          name: 'Get an environment variable',
          value: ['fc.environment.get("variable_key");'],
        },
        {
          id: 'setEnvironmentVariable',
          name: 'Set an environment variable',
          value: ['fc.environment.set("variable_key", "variable_value");'],
        },
        {
          id: 'clearEnvironmentVariable',
          name: 'Clear an environment variable',
          value: ['fc.environment.unset("variable_key");'],
        },
      ],
      /** @deprecated */
      _snippets: [
        {
          id: 'has',
          name: 'variable exists or not',
          value: 'environment.has("variableName");',
        },
        {
          id: 'has',
          name: 'variable value',
          value: 'environment.get("variableName");',
        },
        {
          id: 'replace',
          name: 'resolve value of dynamic variables from the string content',
          value: 'environment.replace("data");',
        },
        {
          id: 'variables',
          name: 'combined variables of global and collection',
          value: 'environment.variables();',
        },
      ],
    },
    {
      id: 'collection',
      name: 'collection variables',
      snippets: [
        {
          id: 'getCollectionVariable',
          name: 'Get a collection variable',
          value: ['fc.collectionVariables.get("variable_key");'],
        },
        {
          id: 'setCollectionVariable',
          name: 'Set a collection variable',
          value: [
            'fc.collectionVariables.set("variable_key", "variable_value");',
          ],
        },
        {
          id: 'clearCollectionVariable',
          name: 'Clear a collection variable',
          value: ['fc.collectionVariables.unset("variable_key");'],
        },
      ],
      /** @deprecated */
      _snippets: [
        {
          id: 'name',
          name: 'active environment name',
          value: 'environment.collection.name;',
        },
        {
          id: 'set',
          name: 'set the new/overwrite variable in the active environment',
          value: 'environment.collection.set("variableName", "variableValue");',
        },
        {
          id: 'unset',
          name: 'unset variables from the active environment',
          value:
            'environment.collection.unset("variableName1", "variableName2",...,"variableName-n");',
        },
        {
          id: 'clear',
          name: 'remove all variables from the active environment',
          value: 'environment.collection.clear();',
        },
      ],
    },
  ],
};
