import { ReactChildren } from "react";

export interface IModal {
    /**
    * DOM id
    */
    id?: string;
    /**
    * Show close icon flag
    */
    showCloseIcon?: boolean;
    /**
     * Is modal open or not
     */
    isOpen?: boolean;
    /**
     * Classname to show custom styling                 
     */
     className?: string;
    /**
     * Modal class name
     */
    modalClass?: string;
    /**
     * Modal (react-responsive-modal) configuration
     * @ref: https://react-responsive-modal.leopradel.com/#props
     */
    modalConfig?: object;
    /**
     * Function to call on close modal
     */
    onClose?: (e?: any) => any;
    /**    
    * child component        
    */
    children?: any;

    height?: number | string;
    width?: number | string;
}