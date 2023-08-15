export interface IResSize {
    /**
     * HtmlElement class
     */
    className?: string
    /**
     * Response size object to get size payload
     */
    size: number
    /**
     * Boolean value whether request is running (requesting) or not
     */
    isRequestRunning: boolean
}