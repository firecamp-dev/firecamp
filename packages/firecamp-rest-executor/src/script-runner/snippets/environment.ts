export default {
  id: 'environment',
  name: 'Environment Snippets',
  groups: [
    {
      id: 'common',
      name: 'common',
      snippets: [
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
      name: 'collection environment',
      snippets: [
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
