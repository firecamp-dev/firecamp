export interface IDocButton {
    /**
     * Doc button text
     */
    text: string
    /**
     * Link to redirect on page on click button
     */
    link : string
    /**
     * href target
     */
    target: string
    /**
    * Add class name to show custom styling
    */
    className : string
    /**
     * Boolean value whether you want to show icon or not
     */
    showIcon : boolean
    /**
     * Button icon class name
     */
    iconClassName: string
    /**
     * Customize css style
     */
    style : object
}
