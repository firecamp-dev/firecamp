export interface ISecondaryTab {
    /**
     * Child div class name
     */
    className?: string;
    /**
     * Tabs list to display
     */
    list?: Array<any>;
    /**
     * Current active tab among list 
     */
    activeTab?: string;
    /**
     * Boolean value if you wnat to set tab background transpetant or not
     */
    isBgTransperant?: boolean;
    /**
     * supportive components list
     */
    components?: any;
    /**
   * Additional components
   */
    additionalComponent?: any;
    /**
     * A function to get selected tab
     */
    onSelect?: (tab: string) => any;
}
