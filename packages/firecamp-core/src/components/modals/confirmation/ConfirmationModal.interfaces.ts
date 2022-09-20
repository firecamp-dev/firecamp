export interface IConfirmationModal {
  /**
   * To open/close the ConfirmationModal at initial time
   */
  isOpen: boolean;
  /**
   * It specifies the title for the header
   */
  title: string;
  /**
   * It specifies the message to be displayed
   */
  message: string;
  /**
   * To specify some extra note along with the message
   */
  note: string;
  /**
   * To display specific values for confirm/cancel button
   */
  _meta: Object;
  /**
   * To display additional components
   * Todo prop is provided but not utilizes within the component
   */
  additionalComponents: Object;
  /**
   * It specifies the function to be executed on confirmation
   */
  onConfirm: () => any;
  /**
   * It specifies the function to be executed on cancellation
   */
  onCancel: () => any;
  /**
   * It specifies the function to be executed on closing the modal
   */
  onClose: () => any;
}
