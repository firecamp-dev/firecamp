export interface IMenuBar {
    /**
     * Is this the principal call to action on the page?
     */
    id?: string,
    /**
     * Add class name to show custom styling
     */
    className?: string,
    /**
     * pass json to show menu
     */
    menu: []
}