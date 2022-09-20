/**
 * environment scope wise [workspace, collection] APIs
 */
interface ScopeLevelAPI {
    /**
     * return the active environment name
     */
    name: string

    /**
     * set the new variable in the active environment or 
     * overwrite if exist with a new value
     */
    set: (variableName: string, variableValue: string | number | boolean) => void

    /**
     * unset variables from the active environment name
     */
    unset: (...variableNames: string[]) => void

    /**
     * contains the flag to clear all variables from the current active environment
     */
    clearEnvironment: boolean

    /**
     * remove all variables from the active environment
     */
    clear: () => void
}

/**
 * runtime script environment APIs
 */
export interface IEnvironment {
    /**
     * return is variable exists or not
     */
    has: (variableName: string | number) => boolean

    /**
     * return the variable value
     */
    get: (variableName: string | number) => string | number | boolean

    /**
     * resolve value of dynamic variables from the string content
     */
    replace?: (data: string) => string

    /**
     * return the combined variables of workspace and collection
     */
    variables: { [key: string | number]: string | number | boolean }

    /**
     * collection environment APIs
     */
    collection: ScopeLevelAPI

    /**
     * workspace environment APIs
     */
    workspace: ScopeLevelAPI
}