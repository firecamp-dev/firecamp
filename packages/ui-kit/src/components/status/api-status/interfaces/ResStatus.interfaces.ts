export interface IResStatus {
  /**
   * class name to show custom styling
   */
  className?: string;

  /**
   * HTTP response status code
   */
  code: number;
  /**
   * HTTP response status message
   */
  status?: string;
  /**
   * Boolean value whether request is running (requesting) or not
   */
  isRequestRunning: boolean;
}
