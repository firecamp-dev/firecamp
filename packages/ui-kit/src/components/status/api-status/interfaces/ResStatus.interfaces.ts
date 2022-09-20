export interface IResStatus {
  /**
   * Classname to show custom styling
   */
  className?: string;

  /**
   * HTTP response status code
   */
  statusCode: number;
  /**
   * HTTP response status message
   */
  statusMessage?: string;
  /**
   * Boolean value whether request is running (requesting) or not
   */
  isRequestRunning: boolean;
}
