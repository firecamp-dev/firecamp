export interface IStatusBar {
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
}

export interface IPrimaryRegion{
/**
    * Unique identifier          
    */
 id?: string
 
 /**  
 * child component        
 */
 children?: any
}

export interface ISecondaryRegion{
    /**
        * Unique identifier                  
        */
     id?: string
     
     /**  
     * child component        
     */
     children?: any
    }