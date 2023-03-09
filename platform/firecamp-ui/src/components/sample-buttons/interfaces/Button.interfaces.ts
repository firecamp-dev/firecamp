export interface IButton {
    /**
    * Is primary button or not
    */
    primary?: boolean,
    /**
     * What background color to use
     */
    backgroundColor?: string,
    /**
     * How large should the button be?
     */
    size?: string,
    /**                   
     * Button contents
     */
    label?: string,
    /**
     * Optional click handler
     */
    onClick(): any
}