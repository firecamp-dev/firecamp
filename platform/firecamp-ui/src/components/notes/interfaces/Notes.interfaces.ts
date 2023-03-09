export interface INotes {
    /**
     * Title to show the purpose of note
     */
    title?: string
    /**
     * Note brief description
     */
    description?: string
    /**
     * Boolean value whether you want to show note icon or not
     */
    showicon?: boolean
    /**
     * Note type ['info']
     */
    type?: string
    /**
     * Boolean value whether you want to have padding in style
     */
    withpadding?: boolean
}