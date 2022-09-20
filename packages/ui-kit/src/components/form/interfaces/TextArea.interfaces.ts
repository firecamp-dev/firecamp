export interface ITextArea {
    /**
     * Name for input element
     */
    name?: string

    type: string
    /**
     * Classname to show custom styling
     */
    className?: string
    /**
     * Placeholder to show information/ hint
     */
    placeholder?: string
    /**
    * String value for input
    */
    value?: string;

    defaultValue?: string;
    
    /**
    * TextArea label name
    */
    label?: string
    /**
    * TextArea label class name
    */
    labelClassname?: string
    /**
    * TextArea  note/ help supported text
    */
    note?: string
    /**
     * Minimum height of text area
     */
    minHeight?: string;

    disabled?: boolean;
    
    icon?: any; //TODO add proper type
    
    iconPosition?: string; //TODO add enum here

    /**
     * A function to pass text area input value on change
     */
    onChange: (event :any) => any
}