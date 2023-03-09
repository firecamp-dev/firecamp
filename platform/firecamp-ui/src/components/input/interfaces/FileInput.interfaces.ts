export interface IFileInput {
    /**
     * File input button text to show.
     */
    ButtonText: string
    /**
     * File input path on select file
     */
    path: string
    /**
     * File name
     */
    name: string
    /**
     * Function to get file value as call back
     */
    onSelectFile: () => {}
}