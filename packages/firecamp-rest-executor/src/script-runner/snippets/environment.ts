export default {
    id: 'environment',
    name: 'environment',
    snippets: [
        {
            id: 'common',
            name: 'common',
            snippets: [
                {
                    id: 'has',
                    name: 'variable exists or not',
                    snippet: 'environment.has("variableName");'
                },
                {
                    id: 'has',
                    name: 'variable value',
                    snippet: 'environment.get("variableName");'
                },
                {
                    id: 'replace',
                    name: 'resolve value of dynamic variables from the string content',
                    snippet: 'environment.replace("data");'
                },
                {
                    id: 'variables',
                    name: 'combined variables of workspace and collection',
                    snippet: 'environment.variables();'
                },
            ]
        },
        {
            id: 'workspace',
            name: 'workspace environment',
            snippets: [
                {
                    id: 'name',
                    name: 'active workspace name',
                    snippet: 'environment.workspace.name;'
                },
                {
                    id: 'set',
                    name: 'set the new/overwrite variable in the active environment',
                    snippet: 'environment.workspace.set("variableName", "variableValue");'
                },
                {
                    id: 'unset',
                    name: 'unset variables from the active environment',
                    snippet: 'environment.workspace.unset("...variableNames");'
                },
                {
                    id: 'clear',
                    name: 'remove all variables from the active environment',
                    snippet: 'environment.workspace.clear();'
                }
            ]
        },
        {
            id: 'collection',
            name: 'collection environment',
            snippets: [
                {
                    id: 'name',
                    name: 'active environment name',
                    snippet: 'environment.collection.name;'
                },
                {
                    id: 'set',
                    name: 'set the new/overwrite variable in the active environment',
                    snippet: 'environment.collection.set("variableName", "variableValue");'
                },
                {
                    id: 'unset',
                    name: 'unset variables from the active environment',
                    snippet: 'environment.collection.unset("variableName1", "variableName2",...,"variableName-n");'
                },
                {
                    id: 'clear',
                    name: 'remove all variables from the active environment',
                    snippet: 'environment.collection.clear();'
                }
            ]
        }
    ]
}