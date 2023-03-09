import { ReactChild } from "react"

export interface ITabHeader {
    /**
     * Unique identifier for Input
     */
    id?: string,
    /**
     * Content to show in button  
     */
    children?: ReactChild | JSX.Element | JSX.Element[]
    /**
     * Classname to show custom styling
     */
    className?: string,
    /**
     * Optional click handler
     */
    onClick?: () => any

    tooltip?:string
}


export interface ITitle {

    /**
     * Classname to show custom styling                 
     */
    className?: string

    /**  
     * child component        
     */
    children?: any
}

export interface ILeft {

    /**
     * Classname to show custom styling                 
     */
    className?: string

    /**  
     * child component        
     */
    children?: any
}

export interface ICenter {

    /**
     * Classname to show custom styling                 
     */
    className?: string

    /**  
     * child component        
     */
    children?: any
}

export interface IRight {

    /**
     * Classname to show custom styling                 
     */
    className?: string

    /**  
     * child component        
     */
    children?: any
}