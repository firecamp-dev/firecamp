export interface IAlert {
    /**
    * is this the principal call to action on the page?
    */
    id?: string,
    /**
     * add class name to show custom styling
     */
    className?: string,
  
    /**
     * children: child components     
     */
    text?: string,

    success?: boolean,
    error?: boolean,
    info?: boolean,
    warning?: boolean,

    withBorder?: boolean
  }

/**
 * enum: text color 
 */
 export enum EAlertType {
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
    Success = 'success',
    None = 'none',
}  