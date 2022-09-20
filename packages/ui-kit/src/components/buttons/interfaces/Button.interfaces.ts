export interface IButton {
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
    text?: string
    /**
     * Additional icon for button 
     */
    icon?: string | JSX.Element
    /**
     * Button icon position, where do you want to place icon
     */
    iconPosition?: string
    /**
     * Button color
     */
    color?: string
    /**
     * Do you want button to be transparent? No color
     */
    transparent?: boolean
    /**
     * 
     */
    ghost?: boolean
    /**
     * How large should the button be?
     */
    size?: string
    /**
     * Do you want full width or not?
     */
    fullWidth?: boolean
    /**
     * 
     */
    uppercase?: boolean
    /**
     * Content to show in button  
     */
    children?: []
    /**
     * Do you want to show animation on click button?
     */
    animation?: boolean
    /**
     * Optional click handler
     */
    onClick?: (event: any) => any | Promise<any> | Promise<void>
    /**
     * 
     */
    withCaret?: boolean,

    /**
     * True if button is disabled
     */
    disabled?: boolean

    style?: object,

    /**
     * show tooltip on button hover
     */
    tooltip?: string
}

/**
 * enum: Button size 
 */
export enum ESize {
    ExSmall = 'xs',
    Small = 'sm',
    Medium = 'md',
    Large = 'lg'
    
}

/**
 * enum: Button color 
 */
export enum EColor {
    Primary = 'primary',
    Secondary = 'secondary',
    Danger = 'danger',
}

export enum EIconPosition {
    Left = 'left',
    Right = 'right',
    Center = 'center'
}