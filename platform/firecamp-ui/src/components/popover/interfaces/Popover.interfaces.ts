export interface IPopover {

    /**
    * Unique identifier                  
    */
    id?: string

    /**
     * Classname to show custom styling                 
     */
    className?: string

    /**  
    * child component        
    */
    children?: any

    /**
     * Popover content body
     */
    content: JSX.Element | JSX.Element[] | string,

    /**
     * A boolean value states whether you want to allow close on click outside of popover
     */
    closeOnClickOutside?: boolean,

    /**
     * A boolean value to indicate popover works independently(detached) or attached to parent component
     */
    detach?: boolean,

    /**
     * A boolean value whether popover is open or not
     */
    isOpen?: boolean,

    /**
     * Popover position array
     */
    positions?: Array<EPopoverPosition>,

    /**
     * Toggle open popover, function call when popover is not detached          
     */
    onToggleOpen?: (isOpen: boolean) => void
}


export interface IHandler {

    id?: string

    /**
     * A boolean value whether popover is open or not
     */
    isOpen?: boolean

    /**  
    * child component        
    */
    children?: any

    /**
     * Toggle open popover
     */
    toggleOpen?: (isOpen: boolean) => void

    /**
     * Handler tooltip
     */
    tooltip?: string,

    className?: string
}

//-------------------------------------------------enums--------------------------------------

export enum EPopoverPosition {
    Top = 'top',
    Right = 'right',
    Left = 'left',
    Bottom = 'bottom'
}