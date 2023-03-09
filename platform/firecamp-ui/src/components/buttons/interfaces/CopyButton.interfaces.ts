export interface ICopyButton {
    /**
     * Unique identifier for Button                     
     */
    id?: string
    /**
   * Add class name to show custom styling
   */
    className?: string
    /**
     * Button text to show 
     */
    text: string
    /**
    * Do you want to show text or not?    
    */
    showText?: boolean
    /**
     * Content to show in button  
     */
    children?: any[]
    /**
     * Do you want to show animation on click button?
     */
    animation?: boolean
    /**
     * Optional click handler
     */
    onCopy?: (text?: string)=> void
}
