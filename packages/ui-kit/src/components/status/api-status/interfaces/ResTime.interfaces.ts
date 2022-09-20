export interface IResTime {
    /**
     * HtmlElement class
     */
    className?: string

    /**
     * Boolean value whether request is running (requesting) or not
     */
    isRequestRunning: boolean
    
    /**
     * API response time
     */
    duration: number
}